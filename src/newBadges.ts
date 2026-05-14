import type { Profile } from "./types";
import type { AckState } from "./storage";

const NAME = "__name__";
const IMAGE = "__image__";

/** VN runtime gates merged with campaign flags when deciding NEW vs acknowledged. */
export type VnRevealGate = {
  isProfileVisible: (profileId: string) => boolean;
  isNameVisible: (profileId: string) => boolean;
  isImageVisible: (profileId: string) => boolean;
  isEntryVisible: (profileId: string, entryId: string) => boolean;
};

function profileVisibleToPlayer(profile: Profile, vn?: VnRevealGate): boolean {
  return profile.profileRevealed || Boolean(vn?.isProfileVisible(profile.id));
}

export function visibleTokensAfterVisit(profile: Profile): string[] {
  const tokens: string[] = [];
  if (profile.profileRevealed) {
    if (profile.nameRevealed) tokens.push(NAME);
    if (profile.imageRevealed) tokens.push(IMAGE);
    for (const e of profile.entries) {
      if (e.revealed) tokens.push(e.id);
    }
  }
  return tokens;
}

export function isEntryNew(
  profileId: string,
  entryId: string,
  campaignEntryRevealed: boolean,
  ack: AckState,
  vn?: VnRevealGate
): boolean {
  const visible =
    campaignEntryRevealed ||
    Boolean(vn?.isEntryVisible(profileId, entryId));
  if (!visible) return false;
  return !(ack[profileId]?.includes(entryId) ?? false);
}

export function isNameNew(profile: Profile, ack: AckState, vn?: VnRevealGate): boolean {
  if (!profileVisibleToPlayer(profile, vn)) return false;
  const nameOpen =
    profile.nameRevealed || Boolean(vn?.isNameVisible(profile.id));
  if (!nameOpen) return false;
  return !(ack[profile.id]?.includes(NAME) ?? false);
}

export function isImageNew(profile: Profile, ack: AckState, vn?: VnRevealGate): boolean {
  if (!profileVisibleToPlayer(profile, vn)) return false;
  const imageOpen =
    profile.imageRevealed || Boolean(vn?.isImageVisible(profile.id));
  if (!imageOpen) return false;
  return !(ack[profile.id]?.includes(IMAGE) ?? false);
}

export function profileHasAnyNew(
  profile: Profile,
  ack: AckState,
  vn?: VnRevealGate
): boolean {
  if (!profileVisibleToPlayer(profile, vn)) return false;
  if (isNameNew(profile, ack, vn)) return true;
  if (isImageNew(profile, ack, vn)) return true;
  for (const e of profile.entries) {
    if (isEntryNew(profile.id, e.id, e.revealed, ack, vn)) return true;
  }
  return false;
}

/**
 * True when any polaroid on the corkboard would show NEW for this viewer (matches EvidenceBoard).
 * Pass `mergeProfilesWithSeed(data.profiles)` as `catalog` for the same graph as the modal board.
 */
export function corkboardHasUnreadIntel(
  catalog: Profile[],
  ack: AckState,
  vn: VnRevealGate
): boolean {
  const visible = catalog.filter((p) => profileVisibleToPlayer(p, vn));
  return visible.some((p) => profileHasAnyNew(p, ack, vn));
}

export { NAME as ACK_NAME, IMAGE as ACK_IMAGE };
