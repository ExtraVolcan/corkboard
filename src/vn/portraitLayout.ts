import type { VnLine, VnScene } from "./types";
import { canonicalSpeakerId } from "./speakerLabel";

/** Caliban / protagonist — always placed in the left cluster above the dialogue box. */
export const PROTAGONIST_SPEAKER_IDS = new Set<string>(["detective"]);

export type SpeakerPortraitSnapshot = {
  speakerId: string;
  lineIndex: number;
  emotion?: string;
  portraitId?: string;
};

export type PortraitSlot = {
  speakerId: string;
  emotion?: string;
  portraitId?: string;
  isSpeaking: boolean;
};

export type PortraitClusters = {
  left: PortraitSlot[];
  center: PortraitSlot[];
  right: PortraitSlot[];
};

function skipPortraitForSpeaker(speakerId: string | undefined): boolean {
  if (!speakerId) return true;
  return canonicalSpeakerId(speakerId) === "narrator";
}

/** Latest emotion/portrait per speaker after scanning lines 0..lineIndex inclusive. */
export function collectPortraitSnapshots(
  lines: VnLine[],
  lineIndex: number
): Map<string, SpeakerPortraitSnapshot> {
  const map = new Map<string, SpeakerPortraitSnapshot>();
  if (!lines.length || lineIndex < 0) return map;
  const end = Math.min(lineIndex, lines.length - 1);
  for (let i = 0; i <= end; i++) {
    const line = lines[i]!;
    const sid = line.speakerId;
    if (skipPortraitForSpeaker(sid)) continue;
    const base = canonicalSpeakerId(sid!);
    map.set(base, {
      speakerId: base,
      lineIndex: i,
      emotion: line.emotion,
      portraitId: line.portraitId,
    });
  }
  return map;
}

function firstAppearanceLine(lines: VnLine[], speakerId: string): number {
  const base = canonicalSpeakerId(speakerId);
  for (let i = 0; i < lines.length; i++) {
    const sid = lines[i]?.speakerId;
    if (sid && canonicalSpeakerId(sid) === base) return i;
  }
  return 999999;
}

function sortOthersByAppearance(lines: VnLine[], others: string[]): string[] {
  return [...others].sort(
    (a, b) => firstAppearanceLine(lines, a) - firstAppearanceLine(lines, b)
  );
}

/**
 * Left = protagonist (`detective`) when present.
 * Remaining speakers: middle zone(s) then the last speaker (by appearance order) on the right,
 * matching “between left and right” when there are 3+ visible speakers.
 */
export function buildPortraitClusters(
  scene: VnScene,
  lineIndex: number,
  currentSpeakerId: string | undefined
): PortraitClusters {
  const lines = scene.lines;
  const snaps = collectPortraitSnapshots(lines, lineIndex);
  const currentBase = currentSpeakerId
    ? canonicalSpeakerId(currentSpeakerId)
    : undefined;

  const ids = [...snaps.keys()];
  const protagonistIds = ids.filter((id) => PROTAGONIST_SPEAKER_IDS.has(id));
  const othersRaw = ids.filter((id) => !PROTAGONIST_SPEAKER_IDS.has(id));
  const others = sortOthersByAppearance(lines, othersRaw);

  const toSlot = (speakerId: string): PortraitSlot => {
    const s = snaps.get(speakerId)!;
    return {
      speakerId,
      emotion: s.emotion,
      portraitId: s.portraitId,
      isSpeaking: currentBase === speakerId,
    };
  };

  const left: PortraitSlot[] = protagonistIds.map(toSlot);

  if (others.length === 0) {
    return { left, center: [], right: [] };
  }

  if (others.length === 1) {
    return { left, center: [], right: [toSlot(others[0]!)] };
  }

  const middle = others.slice(0, -1).map(toSlot);
  const last = toSlot(others[others.length - 1]!);
  return { left, center: middle, right: [last] };
}
