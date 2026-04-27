import type { VnScene } from "./types";
import { canonicalSpeakerId } from "./speakerLabel";

/**
 * Registry for author-facing story asset ids.
 *
 * Usage in scenes:
 * - scene.background: "bg:office-night"
 * - line.background: optional override per line (persists until another override)
 * - line.portraitId: "portrait:detective-default"
 * - line.emotion + speakerId → "{canonicalSpeakerId}-{emotion}" then bare "{emotion}".
 *   Narrator lines with emotion apply to the detective portrait (inner monologue).
 *
 * `emotion: "think"` is NOT the same token as `emotion: "detective-think"`:
 * - `"think"` tries VN_PORTRAITS["detective-think"] (composite) then VN_PORTRAITS["think"].
 * - `"detective-think"` tries VN_PORTRAITS["detective-detective-think"] then VN_PORTRAITS["detective-think"].
 * Register the URL once under "detective-think" and use either emotion string depending on which fallback you want.
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

/** Portrait URL from explicit id, else emotion-based registry keys when `emotion` is set. */
export function resolvePortraitForSnapshot(opts: {
  speakerId: string;
  emotion?: string;
  portraitId?: string;
}): string | undefined {
  const fromLine = resolvePortrait(opts.portraitId);
  if (fromLine) return fromLine;
  if (!opts.emotion) return undefined;
  const base = canonicalSpeakerId(opts.speakerId);
  const composite = `${base}-${opts.emotion}`;
  const compositeHit = VN_PORTRAITS[composite];
  if (compositeHit) return compositeHit;
  const emotionOnly = VN_PORTRAITS[opts.emotion];
  if (emotionOnly) return emotionOnly;
  return undefined;
}

/** Human-readable hint for dev / placeholder UI: which registry keys are tried (composite first, then bare emotion). */
export function portraitRegistryHint(opts: {
  speakerId: string;
  emotion?: string;
}): string | null {
  if (!opts.emotion?.trim()) return null;
  const base = canonicalSpeakerId(opts.speakerId);
  const e = opts.emotion.trim();
  const composite = `${base}-${e}`;
  return composite === e ? composite : `${composite} · or "${e}"`;
}

/** Last `line.background` wins from scene start through `lineIndex`; falls back to `scene.background`. */
export function resolveEffectiveSceneBackground(
  scene: VnScene,
  lineIndex: number
): string {
  let bg = scene.background;
  if (!scene.lines.length || lineIndex < 0) return bg;
  const end = Math.min(lineIndex, scene.lines.length - 1);
  for (let i = 0; i <= end; i++) {
    const line = scene.lines[i]!;
    if (line.background) bg = line.background;
  }
  return bg;
}

