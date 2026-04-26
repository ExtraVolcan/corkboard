import type { VnCharacter, VnScene } from "./types";
import { VN_CHARACTERS, VN_SCENES } from "./scenes";

export const STORY_BUNDLE_KEY = "mystery-vn-story-bundle-v1";
/** Bumped in memory when the editor saves; VnProvider reloads the bundle. */
export const STORY_RELOAD_EVENT = "mystery-vn-story-reload";

export type StoryBundle = {
  version: 1;
  characters: VnCharacter[];
  scenes: VnScene[];
};

function isSceneArray(x: unknown): x is VnScene[] {
  return Array.isArray(x) && x.length > 0;
}

/**
 * Merged data for the VN: bundled `scenes.ts` unless localStorage has a valid override.
 */
export function loadStoryBundle(): StoryBundle {
  try {
    const raw = localStorage.getItem(STORY_BUNDLE_KEY);
    if (!raw) {
      return { version: 1, characters: VN_CHARACTERS, scenes: VN_SCENES };
    }
    const p = JSON.parse(raw) as Partial<StoryBundle>;
    if (p?.version === 1 && p.scenes && isSceneArray(p.scenes) && p.scenes[0]) {
      return {
        version: 1,
        characters:
          p.characters?.length && Array.isArray(p.characters)
            ? p.characters
            : VN_CHARACTERS,
        scenes: p.scenes,
      };
    }
  } catch {
    // fall through
  }
  return { version: 1, characters: VN_CHARACTERS, scenes: VN_SCENES };
}

export function saveStoryBundle(bundle: StoryBundle): void {
  localStorage.setItem(STORY_BUNDLE_KEY, JSON.stringify(bundle));
  window.dispatchEvent(new CustomEvent(STORY_RELOAD_EVENT));
}

export function clearStoryOverride(): void {
  localStorage.removeItem(STORY_BUNDLE_KEY);
  window.dispatchEvent(new CustomEvent(STORY_RELOAD_EVENT));
}

export function getDefaultStoryBundle(): StoryBundle {
  return { version: 1, characters: VN_CHARACTERS, scenes: VN_SCENES };
}
