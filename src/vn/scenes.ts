import type { VnCharacter, VnScene } from "./types";

export const VN_CHARACTERS: VnCharacter[] = [
  { id: "narrator", name: "Narrator" },
  { id: "detective", name: "Detective Kline", accent: "#7c2d12" },
  { id: "assistant", name: "Rin", accent: "#0f766e" },
];

export const VN_SCENES: VnScene[] = [
  {
    id: "opening",
    title: "An Unfinished Board",
    background:
      "linear-gradient(180deg, rgba(48,30,20,0.95), rgba(30,18,12,0.95))",
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
        unlocks: [
          { type: "revealEntry", profileId: "sarah-chen", entryId: "e1" },
          { type: "revealProfile", profileId: "marcus-veil" },
        ],
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
      },
    ],
  },
  {
    id: "review-pause",
    title: "Case Pause",
    background:
      "linear-gradient(180deg, rgba(38,25,18,0.96), rgba(25,15,10,0.95))",
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
  },
  {
    id: "briefing",
    title: "First Lead",
    background:
      "linear-gradient(180deg, rgba(34,22,18,0.97), rgba(20,12,10,0.96))",
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
          redoable: false,
          options: [
            { id: "loc-docks", label: "The old docks" },
            {
              id: "loc-library",
              label: "The library district",
              correct: true,
              outcome: { setFlags: ["quiz-library-correct"] },
            },
            { id: "loc-courthouse", label: "The courthouse basement" },
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
    ],
  },
];
