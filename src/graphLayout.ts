/**
 * Layout polaroids for the evidence board:
 * - Each **connected component** is laid out with a force sim: springs on edges, repulsion on
 *   **non-adjacent** pairs only (so linked polaroids can sit at ~frame-width apart without fighting
 *   the tall-frame clearance used for everyone else).
 * - **CLUSTER_GAP / CLUSTER_PAD** only affect packing **separate** components on the grid.
 * - After packing, **contractTowardCentroid** pulls every polaroid toward the board centroid so
 *   disconnected clusters move inward; **enforceMinCenterSeparation** runs each step so overlap
 *   never wins. Then string nudges run as before.
 */

export type LinkEdge = { source: string; target: string };

type Pt = { x: number; y: number };

/** Approximate polaroid frame size (see styles) — used for spacing and React Flow top-left. */
const NODE_W = 140;
const NODE_H = 230;

/** Gap between polaroid frame edges at minimum center distance (vertical stack is tightest case). */
const FRAME_PAD = 50;

/**
 * Extra padding around each cluster’s bounding box (used when packing clusters on the grid).
 * Exported for React consumers’ layout deps.
 */
export const CLUSTER_PAD = 12;
/**
 * Minimum gap between cluster padded footprints on the grid (center-to-center minus 2×maxExtent).
 */
export const CLUSTER_GAP = 12;
/**
 * Multiplies node positions after the force step. Keep at 1 for dense layouts.
 */
export const INTRA_CLUSTER_SPREAD = 1;
/** Minimum half-extent for a single isolated polaroid so grid cells don't collapse. */
const MIN_HALF_EXTENT = Math.max(NODE_W / 2 + FRAME_PAD, NODE_H / 2 + FRAME_PAD);

function neighborPairKey(a: string, b: string): string {
  return a < b ? `${a}\0${b}` : `${b}\0${a}`;
}

function connectedComponents(ids: string[], edges: LinkEdge[]): string[][] {
  const adj = new Map<string, Set<string>>();
  for (const id of ids) adj.set(id, new Set());
  for (const e of edges) {
    if (!adj.has(e.source) || !adj.has(e.target)) continue;
    adj.get(e.source)!.add(e.target);
    adj.get(e.target)!.add(e.source);
  }
  const visited = new Set<string>();
  const comps: string[][] = [];
  for (const id of ids) {
    if (visited.has(id)) continue;
    const stack = [id];
    visited.add(id);
    const comp: string[] = [];
    while (stack.length) {
      const v = stack.pop()!;
      comp.push(v);
      for (const w of adj.get(v)!) {
        if (!visited.has(w)) {
          visited.add(w);
          stack.push(w);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}

function edgesWithin(ids: Set<string>, edges: LinkEdge[]): LinkEdge[] {
  return edges.filter((e) => ids.has(e.source) && ids.has(e.target));
}

/**
 * Force-like layout: springs on edges, repulsion between all pairs in the component.
 */
function forceLayoutCluster(
  ids: string[],
  edges: LinkEdge[]
): Map<string, Pt> {
  const pos = new Map<string, Pt>();
  const n = ids.length;
  if (n === 0) return pos;
  if (n === 1) {
    pos.set(ids[0], { x: 0, y: 0 });
    return pos;
  }

  const initR = 28 + n * 6;
  ids.forEach((id, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    pos.set(id, {
      x: initR * Math.cos(a),
      y: initR * Math.sin(a),
    });
  });

  const internal = edgesWithin(new Set(ids), edges);
  const linkedPairs = new Set<string>();
  for (const e of internal) {
    linkedPairs.add(neighborPairKey(e.source, e.target));
  }

  /**
   * Minimum center distance between polaroid **frames** (any orientation, including vertical).
   * Same value for springs (linked) and repulsion (non-neighbors): tall card height dominates.
   * Graph neighbors skip repulsion so the spring can settle here without fighting a larger floor.
   */
  const MIN_CENTER = NODE_H + FRAME_PAD;
  const LINK_LEN = MIN_CENTER;
  const TARGET_MIN = MIN_CENTER;
  const ITER = 220;

  for (let iter = 0; iter < ITER; iter++) {
    const cool = 1 - (iter / ITER) * 0.9;

    const fx = new Map<string, number>(ids.map((id) => [id, 0]));
    const fy = new Map<string, number>(ids.map((id) => [id, 0]));

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const ia = ids[i];
        const ib = ids[j];
        if (linkedPairs.has(neighborPairKey(ia, ib))) continue;
        const pa = pos.get(ia)!;
        const pb = pos.get(ib)!;
        let ox = pb.x - pa.x;
        let oy = pb.y - pa.y;
        let dist = Math.hypot(ox, oy) || 0.01;
        let mag = 0;
        if (dist < TARGET_MIN) {
          mag = ((TARGET_MIN - dist) / dist) * 3.2 * cool;
        } else {
          mag = (5200 / (dist * dist)) * cool;
        }
        ox = (ox / dist) * mag;
        oy = (oy / dist) * mag;
        fx.set(ia, fx.get(ia)! - ox);
        fy.set(ia, fy.get(ia)! - oy);
        fx.set(ib, fx.get(ib)! + ox);
        fy.set(ib, fy.get(ib)! + oy);
      }
    }

    for (const e of internal) {
      const pa = pos.get(e.source);
      const pb = pos.get(e.target);
      if (!pa || !pb) continue;
      let ox = pb.x - pa.x;
      let oy = pb.y - pa.y;
      const dist = Math.hypot(ox, oy) || 0.01;
      const delta = (dist - LINK_LEN) * 0.28 * cool;
      ox = (ox / dist) * delta;
      oy = (oy / dist) * delta;
      fx.set(e.source, fx.get(e.source)! + ox);
      fy.set(e.source, fy.get(e.source)! + oy);
      fx.set(e.target, fx.get(e.target)! - ox);
      fy.set(e.target, fy.get(e.target)! - oy);
    }

    for (const id of ids) {
      const p = pos.get(id)!;
      pos.set(id, {
        x: p.x + fx.get(id)!,
        y: p.y + fy.get(id)!,
      });
    }
  }

  return pos;
}

/**
 * Half-extents for packing clusters on the grid, using polaroid frame size around each center
 * so adjacent cluster cells are spaced far enough that frames cannot overlap.
 */
function bboxMetrics(pos: Map<string, Pt>): { halfW: number; halfH: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const hw = NODE_W / 2;
  const hh = NODE_H / 2;
  for (const p of pos.values()) {
    minX = Math.min(minX, p.x - hw);
    maxX = Math.max(maxX, p.x + hw);
    minY = Math.min(minY, p.y - hh);
    maxY = Math.max(maxY, p.y + hh);
  }
  const halfW = Math.max((maxX - minX) / 2 + CLUSTER_PAD, MIN_HALF_EXTENT);
  const halfH = Math.max((maxY - minY) / 2 + CLUSTER_PAD, MIN_HALF_EXTENT);
  return { halfW, halfH };
}

/**
 * Shift the cluster so the **axis-aligned bounding box of polaroid frames** is centered at the origin.
 * (Centering on node centers only is wrong for asymmetric layouts and made grid spacing underestimate
 * the real footprint — CLUSTER_PAD / CLUSTER_GAP looked ineffective.)
 */
function centerClusterOnFrameBBox(pos: Map<string, Pt>): void {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const hw = NODE_W / 2;
  const hh = NODE_H / 2;
  for (const p of pos.values()) {
    minX = Math.min(minX, p.x - hw);
    maxX = Math.max(maxX, p.x + hw);
    minY = Math.min(minY, p.y - hh);
    maxY = Math.max(maxY, p.y + hh);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (const id of pos.keys()) {
    const p = pos.get(id)!;
    pos.set(id, { x: p.x - cx, y: p.y - cy });
  }
}

function centerToTopLeft(c: Pt): Pt {
  return { x: c.x - NODE_W / 2, y: c.y - NODE_H / 2 };
}

/** Liang–Barsky: segment p0→p1 with t∈[0,1] intersects closed axis-aligned box. */
function segmentHitsAabb(
  p0: Pt,
  p1: Pt,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): boolean {
  let tMin = 0;
  let tMax = 1;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const EPS = 1e-9;

  const clip = (p: number, d: number, lo: number, hi: number): boolean => {
    if (Math.abs(d) < EPS) {
      if (p < lo || p > hi) return false;
      return true;
    }
    const inv = 1 / d;
    let t0 = (lo - p) * inv;
    let t1 = (hi - p) * inv;
    if (t0 > t1) {
      const s = t0;
      t0 = t1;
      t1 = s;
    }
    tMin = Math.max(tMin, t0);
    tMax = Math.min(tMax, t1);
    return tMin <= tMax;
  };

  if (!clip(p0.x, dx, minX, maxX)) return false;
  if (!clip(p0.y, dy, minY, maxY)) return false;
  return tMin <= tMax && tMax >= 0 && tMin <= 1;
}

/**
 * If a string between A and B passes through polaroid U’s frame (U ≠ A,B), nudge U sideways off
 * the segment. Keeps ropes under nodes in z-order while reducing unrelated occlusion.
 */
function nudgeCentersClearForeignEdges(
  centers: Map<string, Pt>,
  edges: LinkEdge[],
  passes: number
): void {
  const inflate = 8;
  const hw = NODE_W / 2 + inflate;
  const hh = NODE_H / 2 + inflate;
  const STEP = 11;

  for (let pass = 0; pass < passes; pass++) {

    for (const e of edges) {
      const ca = centers.get(e.source);
      const cb = centers.get(e.target);
      if (!ca || !cb) continue;

      for (const u of centers.keys()) {
        if (u === e.source || u === e.target) continue;
        const cu = centers.get(u)!;
        const minX = cu.x - hw;
        const maxX = cu.x + hw;
        const minY = cu.y - hh;
        const maxY = cu.y + hh;
        if (!segmentHitsAabb(ca, cb, minX, minY, maxX, maxY)) continue;

        const sx = cb.x - ca.x;
        const sy = cb.y - ca.y;
        const slen = Math.hypot(sx, sy);
        if (slen < 1e-6) continue;
        let nx = -sy / slen;
        let ny = sx / slen;
        const midx = (ca.x + cb.x) / 2;
        const midy = (ca.y + cb.y) / 2;
        if (nx * (cu.x - midx) + ny * (cu.y - midy) < 0) {
          nx = -nx;
          ny = -ny;
        }
        centers.set(u, { x: cu.x + nx * STEP, y: cu.y + ny * STEP });
      }
    }
  }
}

/** Enforce minimum center distance so cards never overlap (all pairs, global). */
function enforceMinCenterSeparation(
  centers: Map<string, Pt>,
  minCenter: number,
  iterations: number
): void {
  const ids = [...centers.keys()];
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const ia = ids[i]!;
        const ib = ids[j]!;
        const pa = centers.get(ia)!;
        const pb = centers.get(ib)!;
        let ox = pb.x - pa.x;
        let oy = pb.y - pa.y;
        const dist = Math.hypot(ox, oy);
        if (!dist || dist >= minCenter) continue;
        const push = (minCenter - dist) / 2;
        ox /= dist;
        oy /= dist;
        centers.set(ia, { x: pa.x - ox * push, y: pa.y - oy * push });
        centers.set(ib, { x: pb.x + ox * push, y: pb.y + oy * push });
      }
    }
  }
}

/**
 * Pull every polaroid toward the current centroid so scattered / grid-spaced components tighten.
 * Separation runs inside the loop so attraction never collapses the layout past MIN_CENTER.
 */
function contractTowardCentroid(
  centers: Map<string, Pt>,
  minCenter: number,
  iterations: number,
  pullMin: number,
  pullMax: number
): void {
  const ids = [...centers.keys()];
  if (ids.length <= 1) return;
  for (let iter = 0; iter < iterations; iter++) {
    const t = iterations <= 1 ? 0 : iter / (iterations - 1);
    const pull = pullMax + (pullMin - pullMax) * t;

    let sx = 0;
    let sy = 0;
    for (const id of ids) {
      const p = centers.get(id)!;
      sx += p.x;
      sy += p.y;
    }
    const n = ids.length;
    const cx = sx / n;
    const cy = sy / n;

    for (const id of ids) {
      const p = centers.get(id)!;
      centers.set(id, {
        x: p.x + pull * (cx - p.x),
        y: p.y + pull * (cy - p.y),
      });
    }
    enforceMinCenterSeparation(centers, minCenter, 10);
  }
}

/**
 * Top-left positions for React Flow from profile ids and undirected link edges.
 */
export function layoutPolaroidPositions(
  profileIds: string[],
  linkEdges: LinkEdge[]
): Map<string, Pt> {
  const topLeft = new Map<string, Pt>();
  if (profileIds.length === 0) return topLeft;

  const comps = connectedComponents(profileIds, linkEdges);
  comps.sort((a, b) => b.length - a.length);

  type Packed = { ids: string[]; pos: Map<string, Pt>; halfW: number; halfH: number };
  const packed: Packed[] = [];

  for (const ids of comps) {
    const pos = forceLayoutCluster(ids, linkEdges);
    for (const id of ids) {
      const p = pos.get(id)!;
      pos.set(id, {
        x: p.x * INTRA_CLUSTER_SPREAD,
        y: p.y * INTRA_CLUSTER_SPREAD,
      });
    }
    centerClusterOnFrameBBox(pos);
    const { halfW, halfH } = bboxMetrics(pos);
    packed.push({ ids, pos, halfW, halfH });
  }

  let maxHalfW = MIN_HALF_EXTENT;
  let maxHalfH = MIN_HALF_EXTENT;
  for (const p of packed) {
    maxHalfW = Math.max(maxHalfW, p.halfW);
    maxHalfH = Math.max(maxHalfH, p.halfH);
  }

  /**
   * Square cells from the larger half-axis so diagonal neighbors on the grid
   * (same row+1 col+1) don’t corner-overlap when clusters are wider than tall or vice versa.
   */
  const maxExtent = Math.max(maxHalfW, maxHalfH);
  const cellSize = 2 * maxExtent + CLUSTER_GAP;
  const cellW = cellSize;
  const cellH = cellSize;
  const n = packed.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
  const rows = Math.ceil(n / cols);

  const centers = new Map<string, Pt>();

  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const gx = (col - (cols - 1) / 2) * cellW;
    const gy = (row - (rows - 1) / 2) * cellH;
    const { pos } = packed[i];
    for (const [id, c] of pos) {
      centers.set(id, { x: c.x + gx, y: c.y + gy });
    }
  }

  const minCenter = NODE_H + FRAME_PAD;
  contractTowardCentroid(centers, minCenter, 72, 0.045, 0.14);
  nudgeCentersClearForeignEdges(centers, linkEdges, 18);
  enforceMinCenterSeparation(centers, minCenter, 42);
  nudgeCentersClearForeignEdges(centers, linkEdges, 10);

  for (const [id, c] of centers) {
    topLeft.set(id, centerToTopLeft(c));
  }

  return topLeft;
}
