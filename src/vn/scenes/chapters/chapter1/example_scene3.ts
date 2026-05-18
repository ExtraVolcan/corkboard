import type { VnScene } from "../../../types";

export const scene3: VnScene = {
  id: "example_briefing",
  title: "First Lead",
  background: "bg:office-briefing",
  lines: [
    {
      speakerId: "detective",
      text: "Our strongest lead still points to the library district.",
      unlocks: [
        { type: "revealEntry", profileId: "marcus-veil", entryId: "e1" },
        { type: "revealProfile", profileId: "the-archivist" },
      ],
    },
    {
      speakerId: "assistant",
      text: "If you need to refresh any names, the corkboard button is always available.",
      unlocks: [{ type: "revealName", profileId: "the-archivist" }],
    },
    {
      speakerId: "detective",
      text: "Quick check: which location is our strongest current lead?",
      interaction: {
        kind: "mcq",
        prompt: "Where does the strongest lead point right now?",
        options: [
          {
            id: "loc-docks",
            label: "The old docks",
            wrongFeedback:
              "Nothing we've logged puts the strongest lead at the docks.",
          },
          {
            id: "loc-library",
            label: "The library district",
            correct: true,
            outcome: { setFlags: ["quiz-library-correct"] },
          },
          {
            id: "loc-courthouse",
            label: "The courthouse basement",
            wrongFeedback:
              "The courthouse basement isn't where the briefing aimed us.",
          },
        ],
        onIncorrect: { setFlags: ["quiz-library-missed-once"] },
      },
    },
    {
      speakerId: "assistant",
      text: "Fine. Then say it out loud.",
      interaction: {
        kind: "accuse",
        prompt: "WHO SHOULD WE WATCH NEXT?",
        correctProfileId: "marcus-veil",
        submitLabel: "It's you!",
        onCorrect: { setFlags: ["accused-marcus"] },
        onIncorrect: { setFlags: ["accused-wrong-person"] },
      },
    },
    {
      speakerId: "assistant",
      requireFlags: ["reviewed-board-once"],
      text: "Since you've already reviewed the board once, you're spotting links faster.",
    },
    // Effects authoring reference (optional dev lines):
    // { speakerId: "narrator", text: "…", textEffect: "jitter" },
    // { speakerId: "narrator", text: "…", screenEffect: "catastrophe-vignette-once", screenEffectIntensity: 0.85 },
    // { speakerId: "narrator", text: "…", screenEffect: null },
  ],
};

