import type { VnLine, VnScene } from "./types";
import { canonicalSpeakerId } from "./speakerLabel";

/** Caliban / protagonist — always placed in the left cluster above the dialogue box. */
export const PROTAGONIST_SPEAKER_IDS = new Set<string>(["detective"]);

/** Narrator lines with `emotion` update the detective portrait (inner monologue). */
export const INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID = "detective";

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

function skipPortraitForSpeaker(line: VnLine): boolean {
  const sid = line.speakerId;
  if (!sid) return true;
  const base = canonicalSpeakerId(sid);
  if (base === "narrator") {
    return !line.emotion?.trim();
  }
  return false;
}

/** Which portrait slot should appear “active” for this line (inner thoughts → detective). */
export function resolvePortraitHighlightSpeakerId(
  line: VnLine | undefined
): string | undefined {
  if (!line?.speakerId) return undefined;
  const base = canonicalSpeakerId(line.speakerId);
  if (base === "narrator") {
    return line.emotion?.trim() ? INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID : undefined;
  }
  return base;
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
    if (skipPortraitForSpeaker(line)) continue;
    const sid = line.speakerId!;
    const base = canonicalSpeakerId(sid);
    const portraitSpeakerId =
      base === "narrator" ? INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID : base;
    map.set(portraitSpeakerId, {
      speakerId: portraitSpeakerId,
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
 * Remaining speakers: middle zone(s) then the last speaker (by appearance order) on the right.
 */
export function buildPortraitLayout(
  scene: VnScene,
  lineIndex: number,
  highlightSpeakerId: string | undefined
): PortraitClusters {
  const lines = scene.lines;
  const snaps = collectPortraitSnapshots(lines, lineIndex);

  const toSlot = (speakerId: string): PortraitSlot => {
    const s = snaps.get(speakerId)!;
    return {
      speakerId,
      emotion: s.emotion,
      portraitId: s.portraitId,
      isSpeaking: highlightSpeakerId === speakerId,
    };
  };

  const ids = [...snaps.keys()];
  const protagonistIds = ids.filter((id) => PROTAGONIST_SPEAKER_IDS.has(id));
  const othersRaw = ids.filter((id) => !PROTAGONIST_SPEAKER_IDS.has(id));
  const others = sortOthersByAppearance(lines, othersRaw);

  const left: PortraitSlot[] = protagonistIds.map(toSlot);

  if (others.length === 0) {
    return { left, center: [], right: [] };
  }

  if (others.length === 1) {
    return {
      left,
      center: [],
      right: [toSlot(others[0]!)],
    };
  }

  const middle = others.slice(0, -1).map(toSlot);
  const last = toSlot(others[others.length - 1]!);
  return { left, center: middle, right: [last] };
}
