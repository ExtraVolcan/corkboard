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
 * Hole half-axes scale with aspect ratio: on tall phones holeRy > holeRx so the
 * cutout is taller than wide in pixel space (encroach equally from all edges).
 *   holeRy = holeRx / aspectRatio   (aspectRatio = width / height)
 *
 * VIGNETTE_FEATHER          Soft edge of the oval boundary.
 * VIGNETTE_EDGE_FLOOR       Keeps corners filled with letters.
 * VIGNETTE_BREATHE_AMOUNT   Letter shimmer.
 * CATASTROPHE_CYCLE_MS      Cycle length.
 * VIGNETTE_SHRINK_PHASE_END   Fraction of cycle for the shrink phase (rest = grow).
 *
 * CSS rim wash: `.vn-screen-effect--catastrophe::before` in styles.css
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Starting clear hole (tiny); text initially covers the full screen. */
export const VIGNETTE_HOLE_ENTRY_FRAC = 1.00;

/**
 * Minimum clear oval: half-axis as fraction of half-screen (0.5 from center to edge).
 * 0.30 → clear oval spans ~60% of screen width and ~60% of screen height.
 */
export const VIGNETTE_HOLE_MIN_SCREEN_FRAC = 0.7;

/** Hole larger than the frame → effect fully off. */
export const VIGNETTE_HOLE_OVERSHOOT_FRAC = 0.82;

export const VIGNETTE_CENTER_X = 0.5;
export const VIGNETTE_CENTER_Y = 0.5;

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

export const CATASTROPHE_CYCLE_MS = 5800;

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

function clampAspect(aspectRatio: number): number {
  return Math.max(0.45, Math.min(2.25, aspectRatio));
}

/** Aspect-correct hole half-axes (ny axis stretches on tall screens). */
export function holeAxesForScreen(
  holeRx: number,
  aspectRatio: number
): VignetteHoleAxes {
  const aspect = clampAspect(aspectRatio);
  return {
    holeRx,
    holeRy: holeRx / aspect,
  };
}

/**
 * Animated clear oval: full-screen text → tighten to min → expand off-screen.
 */
export function vignetteHoleAxes(
  cycleProgress: number,
  aspectRatio: number
): VignetteHoleAxes {
  const aspect = clampAspect(aspectRatio);
  const entryRx = VIGNETTE_HOLE_ENTRY_FRAC;
  const minRx = VIGNETTE_HOLE_MIN_SCREEN_FRAC;
  const overRx = VIGNETTE_HOLE_OVERSHOOT_FRAC;
  const entryRy = entryRx / aspect;
  const minRy = minRx / aspect;
  const overRy = overRx / aspect;

  const p = cycleProgress % 1;

  if (p < VIGNETTE_SHRINK_PHASE_END) {
    const u = p / VIGNETTE_SHRINK_PHASE_END;
    const t = easeOutCubic(u);
    return {
      holeRx: entryRx + (minRx - entryRx) * t,
      holeRy: entryRy + (minRy - entryRy) * t,
    };
  }

  const u = (p - VIGNETTE_SHRINK_PHASE_END) / (1 - VIGNETTE_SHRINK_PHASE_END);
  const t = easeInCubic(u);
  return {
    holeRx: minRx + (overRx - minRx) * t,
    holeRy: minRy + (overRy - minRy) * t,
  };
}

export function catastropheCycleAlpha(cycleProgress: number): number {
  const p = cycleProgress % 1;
  if (p < 0.9) return 1;
  return 1 - smoothstep(0.9, 1, p);
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
