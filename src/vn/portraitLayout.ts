import type { VnLine, VnScene } from "./types";
import { canonicalSpeakerId } from "./speakerLabel";

/** Caliban / protagonist — always placed in the left cluster above the dialogue box. */
export const PROTAGONIST_SPEAKER_IDS = new Set<string>(["detective"]);

/** Narrator lines with `emotion` update the detective portrait (inner monologue). */
export const INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID = "detective";

/** Speakers that never occupy a portrait slot (e.g. tutorial tips). */
export const PORTRAIT_HIDDEN_SPEAKER_IDS = new Set<string>(["tutorial"]);

/**
 * Fixed NPC portrait columns (spatial order left → right: “D … C … B”).
 * 1st NPC by scene appearance → right column; 2nd → middle; 3rd → left. Columns stay reserved so
 * new faces “spawn” into place without shifting existing portraits.
 */
export const NPC_FIXED_SLOT_COUNT = 3;

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
  /**
   * Length {@link NPC_FIXED_SLOT_COUNT}. Index 0 = left column (3rd NPC by appearance), 1 = middle
   * (2nd), 2 = right (1st). `null` = reserved column, character not introduced yet at `lineIndex`.
   */
  npcFixedSlots: (PortraitSlot | null)[];
};

function skipPortraitForSpeaker(line: VnLine): boolean {
  const sid = line.speakerId;
  if (!sid) return true;
  const base = canonicalSpeakerId(sid);
  if (PORTRAIT_HIDDEN_SPEAKER_IDS.has(base)) return true;
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
  if (PORTRAIT_HIDDEN_SPEAKER_IDS.has(base)) return undefined;
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

/**
 * All NPC portrait speaker ids in **first-appearance** order across the whole scene (not clipped
 * by current line). Used so empty fixed columns know which rank each column is for.
 */
export function collectNpcPortraitIdsInSceneOrder(scene: VnScene): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const line of scene.lines) {
    if (skipPortraitForSpeaker(line)) continue;
    const sid = line.speakerId!;
    const base = canonicalSpeakerId(sid);
    const portraitSpeakerId =
      base === "narrator" ? INNER_MONOLOGUE_PORTRAIT_SPEAKER_ID : base;
    if (PROTAGONIST_SPEAKER_IDS.has(portraitSpeakerId)) continue;
    if (seen.has(portraitSpeakerId)) continue;
    seen.add(portraitSpeakerId);
    order.push(portraitSpeakerId);
  }
  return order;
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
 * - **npcFixedSlots**: always {@link NPC_FIXED_SLOT_COUNT} entries. Spatial L→R = 3rd, 2nd, 1st NPC by
 *   **scene-wide** first appearance among non-protagonists (matches `A … D … C … B`). A column stays
 *   `null` until that rank’s character has appeared at or before `lineIndex`; then they render in
 *   place without moving other portraits.
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
  const left: PortraitSlot[] = protagonistIds.map((id) =>
    buildSlot(id, snaps, highlightSpeakerId, lines, lineIndex, {})
  );

  const sceneNpcOrder = collectNpcPortraitIdsInSceneOrder(scene);
  const tier = sceneNpcOrder.slice(0, NPC_FIXED_SLOT_COUNT);

  const npcFixedSlots: (PortraitSlot | null)[] = [];
  for (let slotIdx = 0; slotIdx < NPC_FIXED_SLOT_COUNT; slotIdx++) {
    const charIndex = NPC_FIXED_SLOT_COUNT - 1 - slotIdx;
    if (charIndex >= tier.length) {
      npcFixedSlots.push(null);
      continue;
    }
    const speakerId = tier[charIndex]!;
    if (!snaps.has(speakerId)) {
      npcFixedSlots.push(null);
      continue;
    }
    npcFixedSlots.push(
      buildSlot(speakerId, snaps, highlightSpeakerId, lines, lineIndex, {
        stackZIndex: 220 + slotIdx * 160,
      })
    );
  }

  return { left, npcFixedSlots };
}
