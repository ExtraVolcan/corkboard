import type { VnLine, VnScene } from "./types";
import { canonicalSpeakerId } from "./speakerLabel";

/** Caliban / protagonist — always placed in the left cluster above the dialogue box. */
export const PROTAGONIST_SPEAKER_IDS = new Set<string>(["detective"]);

/** Narrator lines with `emotion` update the detective portrait (inner monologue). */
export const INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID = "detective";

/**
 * Negative margin between consecutive NPC portraits (LTR: each tucks under the one to its right).
 * Larger = heavier overlap = narrower strip toward the detective.
 */
const NPC_PORTRAIT_OVERLAP_PX = 324;

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
  /** Negative margin-left: pull this frame left over the previous sibling in the NPC row. */
  overlapMarginLeftPx?: number;
  /** Stacking order; higher draws on top when portraits overlap. */
  stackZIndex?: number;
};

export type PortraitClusters = {
  left: PortraitSlot[];
  /** One row, DOM order: 1st NPC by appearance, then 3rd+, …, 2nd by appearance (right anchor). */
  npc: PortraitSlot[];
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

/**
 * NPC flex order (LTR): first speaker, then everyone after the second in appearance order,
 * then the **second** speaker last — so that portrait is the rightmost (mirrors the detective on the left).
 */
function npcDomOrderByAppearance(othersSorted: string[]): string[] {
  if (othersSorted.length === 0) return [];
  if (othersSorted.length === 1) return [othersSorted[0]!];
  const o1 = othersSorted[0]!;
  const o2 = othersSorted[1]!;
  const tail = othersSorted.slice(2);
  return [o1, ...tail, o2];
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
 * - **Left**: protagonist (`detective`) — fixed left anchor.
 * - **NPC** (`npc`): one row, end-aligned in CSS. Order is `[1st NPC, 3rd, 4th, …, 2nd NPC]` by scene
 *   appearance so the **second** NPC is the **right** anchor (mirror of the detective). Overlap pulls
 *   earlier slots left so the strip stays compact away from the detective.
 * - Current line `emotion` / highlight still get z-index boosts in {@link buildSlot}.
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

  const order = npcDomOrderByAppearance(others);
  const npc: PortraitSlot[] = order.map((id, i) =>
    buildSlot(id, snaps, highlightSpeakerId, lines, lineIndex, {
      overlapMarginLeftPx: i === 0 ? 0 : -NPC_PORTRAIT_OVERLAP_PX,
      /** Later in DOM = further right = paint on top when overlapping */
      stackZIndex: 200 + i * 120,
    })
  );

  return { left, npc };
}
