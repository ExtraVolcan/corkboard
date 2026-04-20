/**
 * Layout polaroids for the evidence board:
 * - Each connected component is laid out with a local force simulation (cluster).
 * - Components are packed on a grid using frame-inclusive bounding boxes + gap so
 *   different clusters cannot overlap; we do not run a global refinement that would
 *   move polaroids across cluster boundaries.
 */

export type LinkEdge = { source: string; target: string };

type Pt = { x: number; y: number };

/** Approximate polaroid frame size (see styles) — used for spacing and React Flow top-left. */
const NODE_W = 140;
const NODE_H = 230;

/** Extra padding around each cluster’s bounding box (used when packing clusters on the grid). */
const CLUSTER_PAD = 330;
/** Minimum gap between cluster frame bounding boxes when packing on the grid. */
const CLUSTER_GAP = 640;
/** Minimum half-extent for a single isolated polaroid so grid cells don't collapse. */
const MIN_HALF_EXTENT = 96;

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

  const initR = 90 + n * 22;
  ids.forEach((id, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    pos.set(id, {
      x: initR * Math.cos(a),
      y: initR * Math.sin(a),
    });
  });

  const internal = edgesWithin(new Set(ids), edges);
  const LINK_LEN = 380;
  const TARGET_MIN = 400;
  const ITER = 180;

  for (let iter = 0; iter < ITER; iter++) {
    const cool = 1 - (iter / ITER) * 0.9;

    const fx = new Map<string, number>(ids.map((id) => [id, 0]));
    const fy = new Map<string, number>(ids.map((id) => [id, 0]));

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const ia = ids[i];
        const ib = ids[j];
        const pa = pos.get(ia)!;
        const pb = pos.get(ib)!;
        let ox = pb.x - pa.x;
        let oy = pb.y - pa.y;
        let dist = Math.hypot(ox, oy) || 0.01;
        let mag = 0;
        if (dist < TARGET_MIN) {
          mag = ((TARGET_MIN - dist) / dist) * 3.2 * cool;
        } else {
          mag = (15000 / (dist * dist)) * cool;
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
      const delta = (dist - LINK_LEN) * 0.14 * cool;
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

/** Shift positions so bbox center is at origin. */
function centerBBox(pos: Map<string, Pt>): void {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pos.values()) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
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
    centerBBox(pos);
    const { halfW, halfH } = bboxMetrics(pos);
    packed.push({ ids, pos, halfW, halfH });
  }

  let maxHalfW = MIN_HALF_EXTENT;
  let maxHalfH = MIN_HALF_EXTENT;
  for (const p of packed) {
    maxHalfW = Math.max(maxHalfW, p.halfW);
    maxHalfH = Math.max(maxHalfH, p.halfH);
  }

  const cellW = 2 * maxHalfW + CLUSTER_GAP;
  const cellH = 2 * maxHalfH + CLUSTER_GAP;
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

  for (const [id, c] of centers) {
    topLeft.set(id, centerToTopLeft(c));
  }

  return topLeft;
}
