import type { Profile } from "./types";
import seedCampaign from "./data/seed.json";

/** Bundled story dossiers — appended when the live campaign API omits ids the VN can reveal. */
const SEED_PROFILES = seedCampaign.profiles as Profile[];

/** Full profile list for corkboard graph + link resolution when DB/file campaign is behind seed.json. */
export function mergeProfilesWithSeed(apiProfiles: Profile[]): Profile[] {
  const have = new Set(apiProfiles.map((p) => p.id));
  const extra = SEED_PROFILES.filter((p) => !have.has(p.id));
  return extra.length ? [...apiProfiles, ...extra] : apiProfiles;
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
