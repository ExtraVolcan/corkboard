import type { VnCharacter, VnState } from "./types";

const UNKNOWN_SUFFIX = /-\?\?\?$/;

export type SpeakerLabelContext = {
  flags: Record<string, true>;
  reveals: VnState["reveals"];
  /** Corkboard campaign profiles — optional; improves linked-profile name visibility */
  campaignProfiles?: { id: string; nameRevealed: boolean }[];
};

/** Strip trailing `-???` from legacy alias ids (`detective-???` → `detective`). */
export function canonicalSpeakerId(speakerId: string): string {
  return speakerId.replace(UNKNOWN_SUFFIX, "");
}

function nameRevealSatisfied(
  c: VnCharacter,
  ctx: SpeakerLabelContext,
  opts: { legacyUnknownSuffix: boolean }
): boolean {
  const hasMechanism = Boolean(c.nameRevealFlag || c.linkedProfileId);

  // Legacy scene ids like `detective-???` stay unknown until a reveal rule exists and passes.
  if (opts.legacyUnknownSuffix) {
    if (!hasMechanism) return false;
  } else if (!hasMechanism) {
    return true;
  }

  if (c.nameRevealFlag && ctx.flags[c.nameRevealFlag]) return true;

  if (c.linkedProfileId) {
    const pid = c.linkedProfileId;
    if (ctx.reveals[pid]?.name) return true;
    const camp = ctx.campaignProfiles?.find((p) => p.id === pid);
    if (camp?.nameRevealed) return true;
  }

  return false;
}

/**
 * Text shown in the nameplate. `null` = hide the name row (narrator / thoughts).
 * Legacy `speakerId` values ending in `-???` resolve to the base character entry.
 */
export function resolveSpeakerDisplayLabel(
  speakerId: string | undefined,
  charById: Map<string, VnCharacter>,
  ctx: SpeakerLabelContext
): string | null {
  if (!speakerId) return null;

  const baseId = canonicalSpeakerId(speakerId);
  const canonical =
    charById.get(baseId) ?? charById.get(speakerId);

  if (!canonical) return "???";

  if (canonical.hideSpeakerLabel) return null;

  const unknownLabel =
    canonical.unknownName === ""
      ? ""
      : (canonical.unknownName ?? "???");

  const legacyUnknownSuffix = UNKNOWN_SUFFIX.test(speakerId);
  const revealed = nameRevealSatisfied(canonical, ctx, {
    legacyUnknownSuffix,
  });

  if (!revealed) {
    return unknownLabel.trim() === "" ? null : unknownLabel;
  }

  return canonical.name.trim() === "" ? null : canonical.name;
}

/** Initial for portrait placeholder when name is hidden */
export function resolveSpeakerPlaceholderInitial(
  speakerId: string | undefined,
  charById: Map<string, VnCharacter>,
  ctx: SpeakerLabelContext
): string {
  const label = resolveSpeakerDisplayLabel(speakerId, charById, ctx);
  if (label && label !== "???") {
    return label.trim()[0]?.toUpperCase() ?? "?";
  }
  return "?";
}
