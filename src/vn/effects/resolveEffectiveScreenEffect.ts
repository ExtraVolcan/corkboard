import type { VnScene } from "../types";
import type { VnScreenEffect } from "./types";

/** Last `line.screenEffect` from scene start through `lineIndex`. */
export function resolveEffectiveScreenEffect(
  scene: VnScene,
  lineIndex: number
): VnScreenEffect | null {
  let effect: VnScreenEffect | null = null;
  if (!scene.lines.length || lineIndex < 0) return effect;
  const end = Math.min(lineIndex, scene.lines.length - 1);
  for (let i = 0; i <= end; i++) {
    const line = scene.lines[i]!;
    if (line.screenEffect === null) effect = null;
    else if (line.screenEffect) effect = line.screenEffect;
  }
  return effect;
}

/** Last `line.screenEffectIntensity` (0–1), default 1. */
export function resolveEffectiveScreenEffectIntensity(
  scene: VnScene,
  lineIndex: number
): number {
  let intensity = 1;
  if (!scene.lines.length || lineIndex < 0) return intensity;
  const end = Math.min(lineIndex, scene.lines.length - 1);
  for (let i = 0; i <= end; i++) {
    const line = scene.lines[i]!;
    if (line.screenEffectIntensity != null) {
      intensity = Math.max(0, Math.min(1, line.screenEffectIntensity));
    }
  }
  return intensity;
}

/** Line index where the current screen effect was last turned on (after clear or type change). */
export function resolveScreenEffectActivationLine(
  scene: VnScene,
  lineIndex: number
): number {
  if (!scene.lines.length || lineIndex < 0) return 0;
  const end = Math.min(lineIndex, scene.lines.length - 1);
  let effect: VnScreenEffect | null = null;
  let activation = 0;
  for (let i = 0; i <= end; i++) {
    const line = scene.lines[i]!;
    if (line.screenEffect === null) {
      effect = null;
      activation = i;
    } else if (line.screenEffect) {
      if (line.screenEffect !== effect) activation = i;
      effect = line.screenEffect;
    }
  }
  return activation;
}
