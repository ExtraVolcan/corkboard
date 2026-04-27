import type { VnScene } from "../../../types";

export const scene1: VnScene = {
  id: "opening",
  title: "An Unfinished Board",
  background: "bg:office-night",
  lines: [
    {
      speakerId: "narrator",
      text: "Rain taps against the office window. A new envelope waits on your desk.",
      unlocks: [
        { type: "revealProfile", profileId: "sarah-chen" },
        { type: "revealName", profileId: "sarah-chen" },
      ],
    },
    {
      speakerId: "assistant",
      text: "You can review the corkboard at any time. We should keep it up to date while we read these statements.",
      unlocks: [{ type: "revealImage", profileId: "sarah-chen" }],
    },
    {
      speakerId: "detective",
      text: "Let's start with the first witness summary.",
      choices: [
        {
          id: "open-corkboard-first",
          label: "Review corkboard first",
          nextSceneId: "review-pause",
          setFlags: ["reviewed-board-once"],
        },
        {
          id: "continue-briefing",
          label: "Continue briefing",
          nextSceneId: "briefing",
        },
      ],
      unlocks: [
        { type: "revealEntry", profileId: "sarah-chen", entryId: "e1" },
        { type: "revealProfile", profileId: "marcus-veil" },
      ],
    },
  ],
};

