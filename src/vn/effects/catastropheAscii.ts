import { prepareWithSegments } from "@chenglou/pretext";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CATASTROPHE VIGNETTE — tuning guide
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The clear center is an axis-aligned ellipse in normalized screen space
 * (nx, ny ∈ 0–1). Letters draw OUTSIDE that oval only.
 *
 * ANIMATION (one cycle)
 * ─────────────────────
 * 1. Start: hole tiny → text covers the whole screen (encroachment from off-screen).
 * 2. Shrink (ease-out / decelerate): hole grows to minimum → ring tightens toward center.
 * 3. Grow (ease-in / accelerate): hole expands past the frame → text vanishes.
 *
 * HOLE SIZE (fraction of full screen width / height)
 * ────────────────────────────────────────────────
 * VIGNETTE_HOLE_ENTRY_FRAC   Starting clear hole (tiny → full-screen text).
 * VIGNETTE_HOLE_MIN_SCREEN_FRAC  Minimum clear hole half-axis (0.30 ≈ 60% of screen
 *                            width/height across the oval). ↑ = larger clear center.
 * VIGNETTE_HOLE_OVERSHOOT_FRAC   End hole (>0.5) → entire frame clear, effect gone.
 *
 * SHAPE & POSITION (matches device aspect)
 * ───────────────────────────────────────
 * VIGNETTE_CENTER_X, VIGNETTE_CENTER_Y   Oval center (0–1).
 * Use the same normalized half-axis for X and Y (holeRy = holeRx). nx and ny already
 * span the full width and height, so in pixels the clear oval is (r·W) × (r·H) and
 * matches the screen’s width:height ratio.
 *
 * VIGNETTE_FEATHER          Soft edge of the oval boundary.
 * VIGNETTE_EDGE_FLOOR       Keeps corners filled with letters.
 * VIGNETTE_BREATHE_AMOUNT   Letter shimmer.
 * CATASTROPHE_CYCLE_MS      Cycle length.
 * VIGNETTE_SHRINK_PHASE_END   Fraction of cycle for the shrink phase (rest = grow).
 *
 * Scene lines: `screenEffect: "catastrophe-vignette"` loops; `"catastrophe-vignette-once"`
 * plays a single cycle then hides until cleared with `screenEffect: null`.
 *
 * CSS rim wash: `.vn-screen-effect--catastrophe::before` in styles.css
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Starting clear hole (whole screen); initially covers the full screen. */
export const VIGNETTE_HOLE_ENTRY_FRAC = 1.00;

/**
 * Minimum clear oval: half-axis as fraction of half-screen (0.5 from center to edge).
 * 0.30 → clear oval spans ~60% of screen width and ~60% of screen height.
 */
export const VIGNETTE_HOLE_MIN_SCREEN_FRAC = 0.4;

/** Hole larger than the frame → effect fully off. */
export const VIGNETTE_HOLE_OVERSHOOT_FRAC = 0.82;

export const VIGNETTE_CENTER_X = 0.5;
export const VIGNETTE_CENTER_Y = 0.5;//lower value = higher

export const VIGNETTE_FEATHER = 0.14;

export const VIGNETTE_EDGE_FLOOR = 0.72;

export const VIGNETTE_BREATHE_AMOUNT = 0.1;

/** 0–1: shrink phase ends here; remainder is grow (ease-in). */
export const VIGNETTE_SHRINK_PHASE_END = 0.38;

export const CATASTROPHE_WORD = "CATASTROPHE";

export const CATASTROPHE_FONT_SIZE = 11;
export const CATASTROPHE_FONT_FAMILY =
  '"Special Elite", Georgia, "Times New Roman", serif';

const PRIMARY_FONT = `700 ${CATASTROPHE_FONT_SIZE}px ${CATASTROPHE_FONT_FAMILY}`;

export const CATASTROPHE_CYCLE_MS = 1800;

const MAX_COLS = 58;
const MAX_ROWS = 34;

export type VignetteHoleAxes = {
  holeRx: number;
  holeRy: number;
};

export type CatastropheCellMetrics = {
  cellW: number;
  lineH: number;
  offsetX: number;
  offsetY: number;
  cols: number;
  rows: number;
  primaryFont: string;
  chars: string[];
};

let cachedCellW: number | null = null;

function measureWidth(ch: string, font: string): number {
  const prepared = prepareWithSegments(ch, font);
  return prepared.widths.length > 0 ? prepared.widths[0]! : CATASTROPHE_FONT_SIZE * 0.6;
}

export function computeCatastropheCellMetrics(
  width: number,
  height: number
): CatastropheCellMetrics {
  if (cachedCellW == null) {
    cachedCellW = measureWidth("C", PRIMARY_FONT) * 1.02;
  }
  let cols = Math.max(8, Math.ceil(width / cachedCellW));
  let rows = Math.max(8, Math.ceil(height / (CATASTROPHE_FONT_SIZE * 1.12)));
  if (cols > MAX_COLS) cols = MAX_COLS;
  if (rows > MAX_ROWS) rows = MAX_ROWS;
  const cellW = width / cols;
  const lineH = height / rows;
  const chars: string[] = new Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      chars[row * cols + col] =
        CATASTROPHE_WORD[(row * cols + col) % CATASTROPHE_WORD.length]!;
    }
  }
  return {
    cellW,
    lineH,
    offsetX: 0,
    offsetY: 0,
    cols,
    rows,
    primaryFont: PRIMARY_FONT,
    chars,
  };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function easeInCubic(t: number): number {
  return t ** 3;
}

/** Equal normalized half-axes → pixel oval matches screen aspect. */
export function holeAxesForScreen(holeRx: number): VignetteHoleAxes {
  return { holeRx, holeRy: holeRx };
}

/**
 * Animated clear oval: full-screen text → tighten to min → expand off-screen.
 */
export function vignetteHoleAxes(cycleProgress: number): VignetteHoleAxes {
  const entryR = VIGNETTE_HOLE_ENTRY_FRAC;
  const minR = VIGNETTE_HOLE_MIN_SCREEN_FRAC;
  const overR = VIGNETTE_HOLE_OVERSHOOT_FRAC;

  const p = Math.min(1, Math.max(0, cycleProgress));

  if (p < VIGNETTE_SHRINK_PHASE_END) {
    const u = p / VIGNETTE_SHRINK_PHASE_END;
    const t = easeOutCubic(u);
    const holeR = entryR + (minR - entryR) * t;
    return { holeRx: holeR, holeRy: holeR };
  }

  const u = (p - VIGNETTE_SHRINK_PHASE_END) / (1 - VIGNETTE_SHRINK_PHASE_END);
  const t = easeInCubic(u);
  const holeR = minR + (overR - minR) * t;
  return { holeRx: holeR, holeRy: holeR };
}

export function catastropheCycleAlpha(cycleProgress: number): number {
  const p = Math.min(1, Math.max(0, cycleProgress));
  if (p < 0.9) return 1;
  return 1 - smoothstep(0.9, 1, p);
}

export function catastropheCycleProgress(
  elapsedMs: number,
  loop: boolean
): number {
  const raw = elapsedMs / CATASTROPHE_CYCLE_MS;
  return loop ? raw % 1 : Math.min(1, raw);
}

/**
 * Letter strength outside the clear ellipse (center = transparent).
 */
export function catastropheCellStrength(
  nx: number,
  ny: number,
  hole: VignetteHoleAxes,
  wobble: number
): number {
  const dx = (nx - VIGNETTE_CENTER_X) / Math.max(hole.holeRx, 0.02);
  const dy = (ny - VIGNETTE_CENTER_Y) / Math.max(hole.holeRy, 0.02);
  const ellDistSq = dx * dx + dy * dy;

  if (ellDistSq < 1) return 0;

  const edgeDist = Math.sqrt(ellDistSq);
  const ring = smoothstep(1, 1 + VIGNETTE_FEATHER, edgeDist);

  const rim =
    VIGNETTE_EDGE_FLOOR * smoothstep(1.02, 1.5, edgeDist);

  const breathe =
    1 -
    VIGNETTE_BREATHE_AMOUNT +
    VIGNETTE_BREATHE_AMOUNT * Math.sin(wobble * 0.9 + edgeDist * 3.2);

  return Math.max(0, Math.min(1, Math.max(ring, rim) * breathe));
}

export function catastropheIsDensePhase(hole: VignetteHoleAxes): boolean {
  return hole.holeRx < VIGNETTE_HOLE_MIN_SCREEN_FRAC * 1.12;
}
