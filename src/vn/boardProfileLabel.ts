/** Polaroid caption from campaign profile + VN story overrides. */
export function polaroidCaptionFromCampaign(
  campaignName: string,
  profileDisplayNames: Record<string, string>,
  profileId: string,
  opts: {
    profileVisible: boolean;
    nameVisible: boolean;
  }
): string {
  if (!opts.profileVisible) return "?";
  const override = profileDisplayNames[profileId];
  if (override !== undefined && override !== "") return override;
  if (opts.nameVisible) return campaignName;
  return "?";
}
