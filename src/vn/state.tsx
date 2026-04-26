import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  VnCharacter,
  VnHistoryEntry,
  VnIntent,
  VnScene,
  VnState,
} from "./types";

const SAVE_KEY = "mystery-vn-state-v1";

const CHARACTERS: VnCharacter[] = [
  { id: "narrator", name: "Narrator" },
  { id: "detective", name: "Detective Kline", accent: "#7c2d12" },
  { id: "assistant", name: "Rin", accent: "#0f766e" },
];

const SCENES: VnScene[] = [
  {
    id: "opening",
    title: "An Unfinished Board",
    background:
      "linear-gradient(180deg, rgba(48,30,20,0.95), rgba(30,18,12,0.95))",
    lines: [
      {
        speakerId: "narrator",
        text: "Rain taps against the office window. A new envelope waits on your desk.",
      },
      {
        speakerId: "assistant",
        text: "You can review the corkboard at any time. We should keep it up to date while we read these statements.",
      },
      {
        speakerId: "detective",
        text: "Let's start with the first witness summary.",
        choices: [
          { id: "open-corkboard-first", label: "Review corkboard first", nextSceneId: "review-pause" },
          { id: "continue-briefing", label: "Continue briefing", nextSceneId: "briefing" },
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
      },
      {
        speakerId: "assistant",
        text: "Ready when you are.",
        choices: [{ id: "resume-briefing", label: "Resume briefing", nextSceneId: "briefing" }],
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
      },
      {
        speakerId: "assistant",
        text: "If you need to refresh any names, the corkboard button is always available.",
      },
    ],
  },
];

const SCENES_BY_ID = new Map(SCENES.map((s) => [s.id, s]));
const CHAR_BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

const INITIAL_STATE: VnState = {
  currentSceneId: "opening",
  lineIndex: 0,
  history: [],
  settings: {
    textSpeed: 40,
    autoAdvance: false,
  },
};

type VnContextValue = {
  scenes: VnScene[];
  characters: VnCharacter[];
  state: VnState;
  currentScene: VnScene;
  currentLine: VnScene["lines"][number] | null;
  dispatch: (intent: VnIntent) => void;
  reset: () => void;
  getSpeaker: (speakerId?: string) => VnCharacter | undefined;
};

const VnContext = createContext<VnContextValue | null>(null);

function loadState(): VnState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as VnState;
    if (!SCENES_BY_ID.has(parsed.currentSceneId)) return INITIAL_STATE;
    return parsed;
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: VnState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence errors in constrained environments
  }
}

function pushHistory(
  history: VnHistoryEntry[],
  sceneId: string,
  speakerName: string,
  text: string
): VnHistoryEntry[] {
  const next = [
    ...history,
    { sceneId, speakerName, text, atMs: Date.now() },
  ];
  return next.slice(-400);
}

export function VnProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VnState>(() => loadState());

  const getSpeaker = useCallback(
    (speakerId?: string) => (speakerId ? CHAR_BY_ID.get(speakerId) : undefined),
    []
  );

  const dispatch = useCallback(
    (intent: VnIntent) => {
      setState((prev) => {
        const scene = SCENES_BY_ID.get(prev.currentSceneId) ?? SCENES[0];
        const line = scene.lines[prev.lineIndex] ?? null;
        let next = prev;

        switch (intent.type) {
          case "advanceDialogue": {
            if (!line) return prev;
            if (line.choices?.length) return prev;

            const speaker = getSpeaker(line.speakerId);
            const history = pushHistory(
              prev.history,
              scene.id,
              speaker?.name ?? "Narrator",
              line.text
            );

            if (prev.lineIndex < scene.lines.length - 1) {
              next = { ...prev, lineIndex: prev.lineIndex + 1, history };
            } else {
              next = { ...prev, history };
            }
            break;
          }
          case "chooseOption": {
            if (!line?.choices?.length) return prev;
            const picked = line.choices.find((c) => c.id === intent.optionId);
            if (!picked || !SCENES_BY_ID.has(picked.nextSceneId)) return prev;
            const speaker = getSpeaker(line.speakerId);
            const withChoice = pushHistory(
              prev.history,
              scene.id,
              speaker?.name ?? "Narrator",
              `${line.text} [${picked.label}]`
            );
            next = {
              ...prev,
              currentSceneId: picked.nextSceneId,
              lineIndex: 0,
              history: withChoice,
            };
            break;
          }
          case "goToScene": {
            if (!SCENES_BY_ID.has(intent.sceneId)) return prev;
            next = { ...prev, currentSceneId: intent.sceneId, lineIndex: 0 };
            break;
          }
          case "setTextSpeed": {
            const safe = Math.max(0, Math.min(100, Math.round(intent.value)));
            next = { ...prev, settings: { ...prev.settings, textSpeed: safe } };
            break;
          }
          case "setAutoAdvance": {
            next = {
              ...prev,
              settings: { ...prev.settings, autoAdvance: intent.value },
            };
            break;
          }
        }

        saveState(next);
        return next;
      });
    },
    [getSpeaker]
  );

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    saveState(INITIAL_STATE);
  }, []);

  const currentScene = SCENES_BY_ID.get(state.currentSceneId) ?? SCENES[0];
  const currentLine = currentScene.lines[state.lineIndex] ?? null;

  const value = useMemo<VnContextValue>(
    () => ({
      scenes: SCENES,
      characters: CHARACTERS,
      state,
      currentScene,
      currentLine,
      dispatch,
      reset,
      getSpeaker,
    }),
    [state, currentScene, currentLine, dispatch, reset, getSpeaker]
  );

  return <VnContext.Provider value={value}>{children}</VnContext.Provider>;
}

export function useVn(): VnContextValue {
  const ctx = useContext(VnContext);
  if (!ctx) throw new Error("useVn must be used inside VnProvider");
  return ctx;
}
