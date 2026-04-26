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
  VnRevealAction,
  VnScene,
  VnState,
} from "./types";
import { VN_CHARACTERS, VN_SCENES } from "./scenes";

const SAVE_KEY = "mystery-vn-state-v1";

const CHARACTERS: VnCharacter[] = VN_CHARACTERS;
const SCENES: VnScene[] = VN_SCENES;

const SCENES_BY_ID = new Map(SCENES.map((s) => [s.id, s]));
const CHAR_BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));
const OPENING_LINE = SCENES_BY_ID.get("opening")?.lines[0];

const INITIAL_REVEALS = applyRevealActions(
  {},
  OPENING_LINE?.unlocks
);
const INITIAL_FLAGS = withSetFlags({}, OPENING_LINE?.setFlags);

const INITIAL_STATE: VnState = {
  currentSceneId: "opening",
  lineIndex: 0,
  history: [],
  settings: {
    textSpeed: 40,
    autoAdvance: false,
  },
  flags: INITIAL_FLAGS,
  reveals: INITIAL_REVEALS,
  interaction: interactionStateForLine("opening", 0),
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
  isProfileVisible: (profileId: string) => boolean;
  isNameVisible: (profileId: string) => boolean;
  isImageVisible: (profileId: string) => boolean;
  isEntryVisible: (profileId: string, entryId: string) => boolean;
};

const VnContext = createContext<VnContextValue | null>(null);

function loadState(): VnState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<VnState>;
    if (!parsed.currentSceneId || !SCENES_BY_ID.has(parsed.currentSceneId)) {
      return INITIAL_STATE;
    }
    return {
      ...INITIAL_STATE,
      ...parsed,
      settings: { ...INITIAL_STATE.settings, ...parsed.settings },
      flags: parsed.flags ?? {},
      reveals: parsed.reveals ?? INITIAL_STATE.reveals,
      interaction: parsed.interaction ?? {},
      history: parsed.history ?? [],
    };
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

function hasRequiredFlags(
  flags: Record<string, true>,
  required?: string[]
): boolean {
  if (!required?.length) return true;
  return required.every((f) => Boolean(flags[f]));
}

function withSetFlags(
  flags: Record<string, true>,
  setFlags?: string[]
): Record<string, true> {
  if (!setFlags?.length) return flags;
  const next = { ...flags };
  for (const f of setFlags) next[f] = true;
  return next;
}

function applyRevealActions(
  reveals: VnState["reveals"],
  actions?: VnRevealAction[]
): VnState["reveals"] {
  if (!actions?.length) return reveals;
  let changed = false;
  const next: VnState["reveals"] = { ...reveals };
  for (const a of actions) {
    const prev = next[a.profileId] ?? {};
    let item = prev;
    switch (a.type) {
      case "revealProfile":
        if (!prev.profile) {
          item = { ...item, profile: true };
          changed = true;
        }
        break;
      case "revealName":
        if (!prev.name) {
          item = { ...item, name: true };
          changed = true;
        }
        break;
      case "revealImage":
        if (!prev.image) {
          item = { ...item, image: true };
          changed = true;
        }
        break;
      case "revealEntry": {
        const entries = prev.entries ?? {};
        if (!entries[a.entryId]) {
          item = { ...item, entries: { ...entries, [a.entryId]: true } };
          changed = true;
        }
        break;
      }
    }
    if (item !== prev) next[a.profileId] = item;
  }
  return changed ? next : reveals;
}

function lineAt(sceneId: string, lineIndex: number) {
  const s = SCENES_BY_ID.get(sceneId);
  return s?.lines[lineIndex] ?? null;
}

function nextVisibleLineIndex(
  scene: VnScene,
  fromIndex: number,
  flags: Record<string, true>
): number | null {
  for (let i = fromIndex; i < scene.lines.length; i++) {
    if (hasRequiredFlags(flags, scene.lines[i]?.requireFlags)) return i;
  }
  return null;
}

function interactionKey(sceneId: string, lineIndex: number): string {
  return `${sceneId}::${lineIndex}`;
}

function interactionStateForLine(sceneId: string, lineIndex: number): VnState["interaction"] {
  const line = lineAt(sceneId, lineIndex);
  if (!line?.interaction) return {};
  return {
    lineKey: interactionKey(sceneId, lineIndex),
    selectedOptionIds: [],
    selectedProfileId: undefined,
  };
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

        const goToScene = (
          base: VnState,
          targetSceneId: string,
          flags: Record<string, true>,
          reveals: VnState["reveals"]
        ): VnState => {
          const targetScene = SCENES_BY_ID.get(targetSceneId) ?? SCENES[0];
          const initialIndex = nextVisibleLineIndex(targetScene, 0, flags) ?? 0;
          return {
            ...base,
            currentSceneId: targetScene.id,
            lineIndex: initialIndex,
            flags,
            reveals: applyRevealActions(
              reveals,
              lineAt(targetScene.id, initialIndex)?.unlocks
            ),
            interaction: interactionStateForLine(targetScene.id, initialIndex),
          };
        };

        const goNextLine = (
          base: VnState,
          fromScene: VnScene,
          flags: Record<string, true>,
          reveals: VnState["reveals"]
        ): VnState => {
          const nextLineIndex = nextVisibleLineIndex(
            fromScene,
            base.lineIndex + 1,
            flags
          );
          if (nextLineIndex == null) {
            return { ...base, flags, reveals, interaction: {} };
          }
          return {
            ...base,
            lineIndex: nextLineIndex,
            flags,
            reveals: applyRevealActions(
              reveals,
              lineAt(fromScene.id, nextLineIndex)?.unlocks
            ),
            interaction: interactionStateForLine(fromScene.id, nextLineIndex),
          };
        };

        switch (intent.type) {
          case "advanceDialogue": {
            if (!line) return prev;
            if (line.choices?.length) return prev;
            if (line.interaction) return prev;

            const speaker = getSpeaker(line.speakerId);
            const history = pushHistory(
              prev.history,
              scene.id,
              speaker?.name ?? "Narrator",
              line.text
            );

            const afterLineFlags = withSetFlags(prev.flags, line.setFlags);
            next = goNextLine(
              { ...prev, history },
              scene,
              afterLineFlags,
              prev.reveals
            );
            break;
          }
          case "chooseOption": {
            if (!line?.choices?.length) return prev;
            const picked = line.choices.find(
              (c) =>
                c.id === intent.optionId &&
                hasRequiredFlags(prev.flags, c.requireFlags)
            );
            if (!picked || !SCENES_BY_ID.has(picked.nextSceneId)) return prev;
            const speaker = getSpeaker(line.speakerId);
            const withChoice = pushHistory(
              prev.history,
              scene.id,
              speaker?.name ?? "Narrator",
              `${line.text} [${picked.label}]`
            );
            const withFlags = withSetFlags(prev.flags, [
              ...(line.setFlags ?? []),
              ...(picked.setFlags ?? []),
            ]);
            next = goToScene(
              { ...prev, history: withChoice },
              picked.nextSceneId,
              withFlags,
              prev.reveals
            );
            break;
          }
          case "selectInteractionOption": {
            if (!line?.interaction || line.interaction.kind !== "mcq") return prev;
            const lk = interactionKey(scene.id, prev.lineIndex);
            const selected = prev.interaction.lineKey === lk
              ? prev.interaction.selectedOptionIds ?? []
              : [];
            if (line.interaction.redoable) {
              if (selected.includes(intent.optionId)) return prev;
              next = {
                ...prev,
                interaction: {
                  lineKey: lk,
                  selectedOptionIds: [...selected, intent.optionId],
                  selectedProfileId: prev.interaction.selectedProfileId,
                },
              };
            } else {
              if (selected.length) return prev;
              next = {
                ...prev,
                interaction: {
                  lineKey: lk,
                  selectedOptionIds: [intent.optionId],
                  selectedProfileId: prev.interaction.selectedProfileId,
                },
              };
            }
            break;
          }
          case "selectAccusedProfile": {
            if (!line?.interaction || line.interaction.kind !== "accuse") return prev;
            next = {
              ...prev,
              interaction: {
                lineKey: interactionKey(scene.id, prev.lineIndex),
                selectedProfileId: intent.profileId,
                selectedOptionIds: prev.interaction.selectedOptionIds,
              },
            };
            break;
          }
          case "submitInteraction": {
            if (!line?.interaction) return prev;
            const selectedOptions =
              prev.interaction.lineKey === interactionKey(scene.id, prev.lineIndex)
                ? prev.interaction.selectedOptionIds ?? []
                : [];
            const selectedProfile =
              prev.interaction.lineKey === interactionKey(scene.id, prev.lineIndex)
                ? prev.interaction.selectedProfileId
                : undefined;

            if (line.interaction.kind === "mcq") {
              const lastSelectedId = selectedOptions[selectedOptions.length - 1];
              if (!lastSelectedId) return prev;
              const selected = line.interaction.options.find((o) => o.id === lastSelectedId);
              if (!selected) return prev;
              const isCorrect = selected.correct === true;
              const outcome = isCorrect
                ? (selected.outcome ?? line.interaction.onCorrect)
                : (selected.outcome ?? line.interaction.onIncorrect);
              const withFlags = withSetFlags(
                withSetFlags(prev.flags, line.setFlags),
                outcome?.setFlags
              );
              const withHistory = pushHistory(
                prev.history,
                scene.id,
                "Choice",
                `${line.interaction.prompt} -> ${selected.label}`
              );
              if (!isCorrect && line.interaction.redoable && !outcome?.nextSceneId) {
                next = {
                  ...prev,
                  history: withHistory,
                  flags: withFlags,
                };
                break;
              }
              if (outcome?.nextSceneId) {
                next = goToScene(
                  { ...prev, history: withHistory },
                  outcome.nextSceneId,
                  withFlags,
                  prev.reveals
                );
                break;
              }
              next = goNextLine(
                { ...prev, history: withHistory },
                scene,
                withFlags,
                prev.reveals
              );
              break;
            }

            if (!selectedProfile) return prev;
            const isCorrect = selectedProfile === line.interaction.correctProfileId;
            const outcome = isCorrect
              ? line.interaction.onCorrect
              : line.interaction.onIncorrect;
            const withFlags = withSetFlags(
              withSetFlags(prev.flags, line.setFlags),
              outcome?.setFlags
            );
            const withHistory = pushHistory(
              prev.history,
              scene.id,
              "Accusation",
              `${line.interaction.prompt} -> ${selectedProfile}`
            );
            if (outcome?.nextSceneId) {
              next = goToScene(
                { ...prev, history: withHistory },
                outcome.nextSceneId,
                withFlags,
                prev.reveals
              );
              break;
            }
            next = goNextLine(
              { ...prev, history: withHistory },
              scene,
              withFlags,
              prev.reveals
            );
            break;
          }
          case "goToScene": {
            if (!SCENES_BY_ID.has(intent.sceneId)) return prev;
            next = goToScene(prev, intent.sceneId, prev.flags, prev.reveals);
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

  const isProfileVisible = useCallback(
    (profileId: string) => Boolean(state.reveals[profileId]?.profile),
    [state.reveals]
  );
  const isNameVisible = useCallback(
    (profileId: string) => Boolean(state.reveals[profileId]?.name),
    [state.reveals]
  );
  const isImageVisible = useCallback(
    (profileId: string) => Boolean(state.reveals[profileId]?.image),
    [state.reveals]
  );
  const isEntryVisible = useCallback(
    (profileId: string, entryId: string) =>
      Boolean(state.reveals[profileId]?.entries?.[entryId]),
    [state.reveals]
  );

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
      isProfileVisible,
      isNameVisible,
      isImageVisible,
      isEntryVisible,
    }),
    [
      state,
      currentScene,
      currentLine,
      dispatch,
      reset,
      getSpeaker,
      isProfileVisible,
      isNameVisible,
      isImageVisible,
      isEntryVisible,
    ]
  );

  return <VnContext.Provider value={value}>{children}</VnContext.Provider>;
}

export function useVn(): VnContextValue {
  const ctx = useContext(VnContext);
  if (!ctx) throw new Error("useVn must be used inside VnProvider");
  return ctx;
}
