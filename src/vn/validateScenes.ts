import type { VnScene } from "./types";
import {
  VN_BACKGROUNDS,
  VN_PORTRAITS,
  portraitRegistryHint,
  resolvePortraitForSnapshot,
} from "./assets";
import { canonicalSpeakerId } from "./speakerLabel";

function speakerExists(charIds: Set<string>, speakerId: string): boolean {
  return (
    charIds.has(speakerId) || charIds.has(canonicalSpeakerId(speakerId))
  );
}

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
      if (line.background?.startsWith("bg:")) {
        const bgId = line.background.slice(3);
        if (!VN_BACKGROUNDS[bgId]) {
          push(
            errors,
            `${lp}.background`,
            `Unknown background id "${bgId}" (add to VN_BACKGROUNDS)`
          );
        }
      }
      if (line.speakerId && !speakerExists(charSet, line.speakerId)) {
        push(
          errors,
          `${lp}.speakerId`,
          `Unknown character "${line.speakerId}"`
        );
      }
      if (line.portraitOnly) {
        if (!line.speakerId?.trim()) {
          push(errors, lp, "portraitOnly lines require speakerId");
        } else if (!speakerExists(charSet, line.speakerId)) {
          push(
            errors,
            `${lp}.speakerId`,
            `Unknown character "${line.speakerId}"`
          );
        } else if (!line.portraitId?.trim() && !line.emotion?.trim()) {
          push(
            errors,
            lp,
            "portraitOnly lines require portraitId or emotion"
          );
        } else {
          const base = canonicalSpeakerId(line.speakerId);
          const sidForPortrait =
            base === "narrator" && line.emotion?.trim()
              ? "detective"
              : line.speakerId;
          const resolved = resolvePortraitForSnapshot({
            speakerId: sidForPortrait,
            emotion: line.emotion,
            portraitId: line.portraitId,
          });
          if (!resolved) {
            const hint = portraitRegistryHint({
              speakerId: sidForPortrait,
              emotion: line.emotion,
            });
            push(
              errors,
              lp,
              hint
                ? `portraitOnly: no VN_PORTRAITS match (tried ${hint})`
                : "portraitOnly: no VN_PORTRAITS match for portraitId / emotion"
            );
          }
        }
        if (line.choices?.length) {
          push(errors, lp, "portraitOnly lines cannot include choices");
        }
        if (line.interaction) {
          push(errors, lp, "portraitOnly lines cannot include interaction");
        }
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
          if (
            o.wrongFeedbackSpeakerId &&
            !speakerExists(charSet, o.wrongFeedbackSpeakerId)
          ) {
            push(
              errors,
              `${lp}.interaction.options(${o.id}).wrongFeedbackSpeakerId`,
              `Unknown character "${o.wrongFeedbackSpeakerId}"`
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
      } else if (line.interaction?.kind === "corkboardEntry") {
        const ic = line.interaction;
        if (!ic.question?.trim()) {
          push(errors, `${lp}.interaction.question`, "question text is required");
        }
        if (!ic.profileId?.trim()) {
          push(errors, `${lp}.interaction.profileId`, "profileId is required");
        }
        if (!ic.correctEntryId?.trim()) {
          push(
            errors,
            `${lp}.interaction.correctEntryId`,
            "correctEntryId is required"
          );
        }
        if (
          ic.wrongFeedbackSpeakerId &&
          !speakerExists(charSet, ic.wrongFeedbackSpeakerId)
        ) {
          push(
            errors,
            `${lp}.interaction.wrongFeedbackSpeakerId`,
            `Unknown character "${ic.wrongFeedbackSpeakerId}"`
          );
        }
        for (const key of ["onCorrect", "onIncorrect"] as const) {
          const o = ic[key];
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
