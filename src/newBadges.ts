import type { Profile } from "./types";
import type { AckState } from "./storage";

const NAME = "__name__";
const IMAGE = "__image__";

export function visibleTokensAfterVisit(profile: Profile, isAdmin: boolean): string[] {
  if (isAdmin) return [];
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
  revealed: boolean,
  ack: AckState
): boolean {
  if (!revealed) return false;
  return !(ack[profileId]?.includes(entryId) ?? false);
}

export function isNameNew(profile: Profile, ack: AckState): boolean {
  if (!profile.profileRevealed || !profile.nameRevealed) return false;
  return !(ack[profile.id]?.includes(NAME) ?? false);
}

export function isImageNew(profile: Profile, ack: AckState): boolean {
  if (!profile.profileRevealed || !profile.imageRevealed) return false;
  return !(ack[profile.id]?.includes(IMAGE) ?? false);
}

export function profileHasAnyNew(profile: Profile, ack: AckState, isAdmin: boolean): boolean {
  if (isAdmin || !profile.profileRevealed) return false;
  if (isNameNew(profile, ack)) return true;
  if (isImageNew(profile, ack)) return true;
  for (const e of profile.entries) {
    if (isEntryNew(profile.id, e.id, e.revealed, ack)) return true;
  }
  return false;
}

export { NAME as ACK_NAME, IMAGE as ACK_IMAGE };
