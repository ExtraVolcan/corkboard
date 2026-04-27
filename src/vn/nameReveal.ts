/**
 * Canonical flag id for “player has learned this character’s real name”.
 *
 * Set it from **any line** (not only choices/MCQ):
 *
 * ```ts
 * {
 *   speakerId: "detective",
 *   text: `"Caliban," I say—because that's what's on the badge.`,
 *   setFlags: [characterNameRevealFlag("detective")],
 * }
 * ```
 *
 * Flags apply when the player **advances past** that line (same timing as `unlocks`).
 * You can also set flags on `choices[].setFlags`, MCQ `outcome.setFlags`, etc.
 */
export function characterNameRevealFlag(characterId: string): string {
  return `name-known-${characterId}`;
}
