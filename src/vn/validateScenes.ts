import type { VnScene } from "./types";
import { VN_BACKGROUNDS, VN_PORTRAITS } from "./assets";

export type SceneValidationError = { path: string; message: string };

function push(
  out: SceneValidationError[],
  path: string,
  message: string
): void {
  out.push({ path, message });
}

/**
 * Shallow structure checks: scene ids, choice targets, interaction scene refs, speaker vs character list.
 */
export function validateScenes(
  scenes: VnScene[],
  characterIds: string[]
): SceneValidationError[] {
  const errors: SceneValidationError[] = [];
  const set = new Set(scenes.map((s) => s.id));
  const charSet = new Set(characterIds);

  if (scenes.length === 0) {
    push(errors, "scenes", "At least one scene is required");
    return errors;
  }

  for (let si = 0; si < scenes.length; si++) {
    const scene = scenes[si]!;
    const p = `scenes[${si}](${scene.id})`;
    if (!scene.id) push(errors, `${p}.id`, "Scene id is required");
    if (scene.background?.startsWith("bg:")) {
      const bgId = scene.background.slice(3);
      if (!VN_BACKGROUNDS[bgId]) {
        push(
          errors,
          `${p}.background`,
          `Unknown background id "${bgId}" (add to VN_BACKGROUNDS)`
        );
      }
    }
    if (!scene.lines?.length) {
      push(errors, `${p}.lines`, "Scene has no lines");
    }
    for (let li = 0; li < (scene.lines?.length ?? 0); li++) {
      const line = scene.lines[li]!;
      const lp = `${p}.lines[${li}]`;
      if (line.speakerId && !charSet.has(line.speakerId)) {
        push(
          errors,
          `${lp}.speakerId`,
          `Unknown character "${line.speakerId}"`
        );
      }
      if (line.portraitId) {
        const portraitId = line.portraitId.startsWith("portrait:")
          ? line.portraitId.slice("portrait:".length)
          : line.portraitId;
        if (!VN_PORTRAITS[portraitId]) {
          push(
            errors,
            `${lp}.portraitId`,
            `Unknown portrait id "${portraitId}" (add to VN_PORTRAITS)`
          );
        }
      }
      if (line.choices) {
        for (let ci = 0; ci < line.choices.length; ci++) {
          const c = line.choices[ci]!;
          const n = c.nextSceneId;
          if (n && !set.has(n)) {
            push(
              errors,
              `${lp}.choices[${ci}].nextSceneId`,
              `Unknown scene id "${n}"`
            );
          }
        }
      }
      if (line.interaction?.kind === "mcq") {
        for (const o of line.interaction.options ?? []) {
          const n = o.outcome?.nextSceneId;
          if (n && !set.has(n)) {
            push(
              errors,
              `mcq option ${o.id}.outcome.nextSceneId`,
              `Unknown scene id "${n}"`
            );
          }
        }
        for (const key of ["onCorrect", "onIncorrect"] as const) {
          const o = line.interaction[key];
          if (o?.nextSceneId && !set.has(o.nextSceneId)) {
            push(
              errors,
              `${lp}.interaction.${key}.nextSceneId`,
              `Unknown scene id "${o.nextSceneId}"`
            );
          }
        }
      } else if (line.interaction?.kind === "accuse") {
        if (
          line.interaction.correctProfileId &&
          !charSet.has(line.interaction.correctProfileId)
        ) {
          push(
            errors,
            `${lp}.interaction.correctProfileId`,
            `Unknown character "${line.interaction.correctProfileId}"`
          );
        }
        for (const key of ["onCorrect", "onIncorrect"] as const) {
          const o = line.interaction[key];
          if (o?.nextSceneId && !set.has(o.nextSceneId)) {
            push(
              errors,
              `${lp}.interaction.${key}.nextSceneId`,
              `Unknown scene id "${o.nextSceneId}"`
            );
          }
        }
      }
    }
  }

  return errors;
}
