import type { Profile } from "./types";
import seedCampaign from "./data/seed.json";

/** Bundled story dossiers — appended when the live campaign API omits ids the VN can reveal. */
const SEED_PROFILES = seedCampaign.profiles as Profile[];

/** Full profile list for corkboard graph + link resolution when DB/file campaign is behind seed.json. */
export function mergeProfilesWithSeed(apiProfiles: Profile[]): Profile[] {
  const seedById = new Map(SEED_PROFILES.map((p) => [p.id, p]));
  const merged = apiProfiles.map((api) => {
    const seed = seedById.get(api.id);
    if (!seed) return api;
    const entryIds = new Set(api.entries.map((e) => e.id));
    const extraEntries = seed.entries.filter((e) => !entryIds.has(e.id));
    if (!extraEntries.length) return api;
    return { ...api, entries: [...api.entries, ...extraEntries] };
  });
  const have = new Set(merged.map((p) => p.id));
  const extraProfiles = SEED_PROFILES.filter((p) => !have.has(p.id));
  return extraProfiles.length ? [...merged, ...extraProfiles] : merged;
}

export function findProfileWithSeedFallback(
  apiProfiles: Profile[],
  id: string | undefined
): Profile | undefined {
  if (!id) return undefined;
  return (
    apiProfiles.find((p) => p.id === id) ??
    SEED_PROFILES.find((p) => p.id === id)
  );
}
