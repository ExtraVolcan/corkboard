/** Full-screen overlays driven from scene lines (see resolveEffectiveScreenEffect). */
export type VnScreenEffect =
  | "catastrophe-vignette"
  /** Same animation as {@link catastrophe-vignette} but plays once, then stays off. */
  | "catastrophe-vignette-once";

/** Set on a line to turn off any active screen effect from earlier lines. */
export type VnScreenEffectClear = null;

/** Inline dialogue presentation (no pretext). */
export type VnTextEffect = "jitter";

export function isCatastropheVignetteEffect(
  effect: VnScreenEffect | null
): effect is "catastrophe-vignette" | "catastrophe-vignette-once" {
  return (
    effect === "catastrophe-vignette" ||
    effect === "catastrophe-vignette-once"
  );
}

export function catastropheVignetteLoops(effect: VnScreenEffect): boolean {
  return effect === "catastrophe-vignette";
}
