import type { VnLine, VnScene } from "./types";
import { canonicalSpeakerId } from "./speakerLabel";

/** Caliban / protagonist — always placed in the left cluster above the dialogue box. */
export const PROTAGONIST_SPEAKER_IDS = new Set<string>(["detective"]);

/** Narrator lines with `emotion` update the detective portrait (inner monologue). */
export const INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID = "detective";

/**
 * Horizontal overlap in the middle strip (1st NPC + 3rd+). Larger overlap keeps the strip
 * narrower so 3rd/4th portraits are less likely to be clipped by the scene edge.
 */
const MIDDLE_STRIP_OVERLAP_PX = 108;

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
  /** Negative margin-left to overlap the previous portrait in the middle strip. */
  overlapMarginLeftPx?: number;
  /** Stacking order; higher draws on top when portraits overlap. */
  stackZIndex?: number;
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
  if (line?.portraitOnly) return undefined;
  if (!line?.speakerId) return undefined;
  const base = canonicalSpeakerId(line.speakerId);
  if (base === "narrator") {
    return line.emotion?.trim() ? INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID : undefined;
  }
  return base;
}

function currentLineEmotionUpdatesPortrait(
  lines: VnLine[],
  lineIndex: number,
  portraitSpeakerId: string
): boolean {
  const line = lines[lineIndex];
  if (!line?.emotion?.trim()) return false;
  const sid = line.speakerId;
  if (!sid) return false;
  const base = canonicalSpeakerId(sid);
  if (base === "narrator") {
    return portraitSpeakerId === INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID;
  }
  return canonicalSpeakerId(sid) === portraitSpeakerId;
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

function buildSlot(
  speakerId: string,
  snaps: Map<string, SpeakerPortraitSnapshot>,
  highlightSpeakerId: string | undefined,
  lines: VnLine[],
  lineIndex: number,
  layout: Pick<PortraitSlot, "overlapMarginLeftPx" | "stackZIndex"> = {}
): PortraitSlot {
  const s = snaps.get(speakerId)!;
  const emotionLine = currentLineEmotionUpdatesPortrait(
    lines,
    lineIndex,
    speakerId
  );
  const baseZ = s.lineIndex * 4;
  const z =
    (layout.stackZIndex ?? baseZ) +
    (emotionLine ? 5000 : 0) +
    /** Speaking portrait must paint above overlapping neighbors */
    (highlightSpeakerId === speakerId ? 12000 : 0);

  return {
    speakerId,
    emotion: s.emotion,
    portraitId: s.portraitId,
    isSpeaking: highlightSpeakerId === speakerId,
    overlapMarginLeftPx: layout.overlapMarginLeftPx,
    stackZIndex: z,
  };
}

/**
 * - **Left**: protagonist (`detective`).
 * - **Right** (far right): **second** non-protagonist to speak (`O2`), fixed anchor.
 * - **Center** (between left and right): **first** NPC (`O1`) plus **third+** NPCs (`O3`…),
 *   same baseline, optional horizontal overlap so they read as one middle group.
 * - Current line `emotion` for a portrait adds a z-index boost so that sprite paints on top.
 */
export function buildPortraitLayout(
  scene: VnScene,
  lineIndex: number,
  highlightSpeakerId: string | undefined
): PortraitClusters {
  const lines = scene.lines;
  const snaps = collectPortraitSnapshots(lines, lineIndex);

  const ids = [...snaps.keys()];
  const protagonistIds = ids.filter((id) => PROTAGONIST_SPEAKER_IDS.has(id));
  const othersRaw = ids.filter((id) => !PROTAGONIST_SPEAKER_IDS.has(id));
  const others = sortOthersByAppearance(lines, othersRaw);

  const left: PortraitSlot[] = protagonistIds.map((id) =>
    buildSlot(id, snaps, highlightSpeakerId, lines, lineIndex, {})
  );

  if (others.length === 0) {
    return { left, center: [], right: [] };
  }

  if (others.length === 1) {
    return {
      left,
      center: [],
      right: [
        buildSlot(others[0]!, snaps, highlightSpeakerId, lines, lineIndex, {}),
      ],
    };
  }

  const O1 = others[0]!;
  const O2 = others[1]!;
  const middleTail = others.slice(2);
  const middleOrder = [O1, ...middleTail];

  const center: PortraitSlot[] = middleOrder.map((id, i) =>
    buildSlot(id, snaps, highlightSpeakerId, lines, lineIndex, {
      overlapMarginLeftPx: i === 0 ? 0 : -MIDDLE_STRIP_OVERLAP_PX,
      /** Later joiners stack on top of earlier middle-strip portraits */
      stackZIndex: 300 + i * 80,
    })
  );

  const right: PortraitSlot[] = [
    buildSlot(O2, snaps, highlightSpeakerId, lines, lineIndex, {
      stackZIndex: 260,
    }),
  ];

  return { left, center, right };
}
