/**
 * Registry for author-facing story asset ids.
 *
 * Usage in scenes:
 * - scene.background: "bg:office-night"
 * - line.portraitId: "portrait:detective-default"
 */
export const VN_BACKGROUNDS: Record<string, string> = {
  "office-night":
    "linear-gradient(180deg, rgba(48,30,20,0.95), rgba(30,18,12,0.95))",
  "office-pause":
    "linear-gradient(180deg, rgba(38,25,18,0.96), rgba(25,15,10,0.95))",
  "office-briefing":
    "linear-gradient(180deg, rgba(34,22,18,0.97), rgba(20,12,10,0.96))",
};

export const VN_PORTRAITS: Record<string, string> = {
  // Add real portrait assets here as you create them.
  // Example: "detective-default": "/assets/portraits/detective-default.png"
};

const BG_PREFIX = "bg:";
const PORTRAIT_PREFIX = "portrait:";
const FALLBACK_BG = "linear-gradient(180deg, #20150f, #120b08)";

export function resolveBackground(background: string): string {
  if (!background.startsWith(BG_PREFIX)) return background;
  const id = background.slice(BG_PREFIX.length);
  return VN_BACKGROUNDS[id] ?? FALLBACK_BG;
}

export function resolvePortrait(portraitId?: string): string | undefined {
  if (!portraitId) return undefined;
  const id = portraitId.startsWith(PORTRAIT_PREFIX)
    ? portraitId.slice(PORTRAIT_PREFIX.length)
    : portraitId;
  return VN_PORTRAITS[id];
}

