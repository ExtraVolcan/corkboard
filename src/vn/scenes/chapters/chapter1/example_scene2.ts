import type { VnScene } from "../../../types";

/** Optional corkboard detour — not on the main chapter timeline unless wired from choices. */
export const reviewPauseScene: VnScene = {
  id: "review-pause",
  title: "Case Pause",
  background: "bg:office-pause",
  lines: [
    {
      speakerId: "narrator",
      text: "You pin the newest notes and trace the links with your finger.",
      unlocks: [
        { type: "revealName", profileId: "marcus-veil" },
        { type: "revealImage", profileId: "marcus-veil" },
      ],
    },
    {
      speakerId: "assistant",
      text: "Ready when you are.",
      choices: [
        {
          id: "resume-briefing",
          label: "Resume briefing",
          nextSceneId: "briefing",
        },
      ],
    },
  ],
};

