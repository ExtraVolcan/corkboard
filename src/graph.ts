import type { Profile } from "./types";
import { parseMentionedProfileIds } from "./links";

export type EdgeKey = string;

function edgeKey(a: string, b: string): EdgeKey {
  return a < b ? `${a}__${b}` : `${b}__${a}`;
}

/** Build undirected edges from profile entry text. */
export function buildLinkEdges(
  profiles: Profile[],
  opts: { includeUnrevealedEntries: boolean }
): { source: string; target: string }[] {
  const ids = new Set(profiles.map((p) => p.id));
  const seen = new Set<EdgeKey>();
  const out: { source: string; target: string }[] = [];

  for (const p of profiles) {
    for (const e of p.entries) {
      if (!opts.includeUnrevealedEntries && !e.revealed) continue;
      for (const target of parseMentionedProfileIds(e.text)) {
        if (target === p.id || !ids.has(target)) continue;
        const k = edgeKey(p.id, target);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ source: p.id, target });
      }
    }
  }
  return out;
}
