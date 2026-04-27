import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
import { loadStoryBundle, STORY_RELOAD_EVENT } from "./storySource";

const SAVE_KEY = "mystery-vn-state-v1";

const EMPTY_SCENE: VnScene = {
  id: "_empty",
  title: "Empty",
  background: "#0f172a",
  lines: [{ text: "No scenes in bundle.", setFlags: [] }],
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

function interactionKey(sceneId: string, lineIndex: number): string {
  return `${sceneId}::${lineIndex}`;
}

function lineAt(
  sceneId: string,
  lineIndex: number,
  scenesById: Map<string, VnScene>
) {
  const s = scenesById.get(sceneId);
  return s?.lines[lineIndex] ?? null;
}

function interactionStateForLine(
  sceneId: string,
  lineIndex: number,
  scenesById: Map<string, VnScene>
): VnState["interaction"] {
  const line = lineAt(sceneId, lineIndex, scenesById);
  if (!line?.interaction) return {};
  return {
    lineKey: interactionKey(sceneId, lineIndex),
    selectedOptionIds: [],
    selectedProfileId: undefined,
  };
}

function getInitialVnState(
  scenes: VnScene[],
  scenesById: Map<string, VnScene>
): VnState {
  const first = scenes[0];
  if (!first?.lines.length) {
    return {
      currentSceneId: "",
      lineIndex: 0,
      history: [],
      settings: { textSpeed: 40, autoAdvance: false },
      flags: {},
      reveals: {},
      interaction: {},
    };
  }
  const firstLine = first.lines[0]!;
  const initialReveals = applyRevealActions({}, firstLine.unlocks);
  const initialFlags = withSetFlags({}, firstLine.setFlags);
  return {
    currentSceneId: first.id,
    lineIndex: 0,
    history: [],
    settings: { textSpeed: 40, autoAdvance: false },
    flags: initialFlags,
    reveals: initialReveals,
    interaction: interactionStateForLine(first.id, 0, scenesById),
  };
}

function loadState(): VnState {
  const { scenes } = loadStoryBundle();
  const scenesById = new Map(scenes.map((s) => [s.id, s]));
  const base = getInitialVnState(scenes, scenesById);
  if (!scenes.length) return base;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<VnState>;
    if (!parsed.currentSceneId || !scenesById.has(parsed.currentSceneId)) {
      return base;
    }
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...parsed.settings },
      flags: parsed.flags ?? base.flags,
      reveals: parsed.reveals ?? base.reveals,
      interaction: parsed.interaction ?? base.interaction,
      history: parsed.history ?? [],
    };
  } catch {
    return base;
  }
}

function saveState(state: VnState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // ignore persistence errors
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

export function VnProvider({ children }: { children: ReactNode }) {
  const [storyRev, setStoryRev] = useState(0);
  const [state, setState] = useState<VnState>(() => loadState());

  const bundle = useMemo(() => loadStoryBundle(), [storyRev]);
  const { scenes, characters } = bundle;
  const scenesById = useMemo(
    () => new Map(scenes.map((s) => [s.id, s])),
    [scenes]
  );
  const charById = useMemo(
    () => new Map(characters.map((c) => [c.id, c])),
    [characters]
  );

  useEffect(() => {
    const onReload = () => setStoryRev((r) => r + 1);
    window.addEventListener(STORY_RELOAD_EVENT, onReload);
    return () => window.removeEventListener(STORY_RELOAD_EVENT, onReload);
  }, []);

  useEffect(() => {
    if (storyRev === 0) return;
    const b = loadStoryBundle();
    const m = new Map(b.scenes.map((s) => [s.id, s]));
    const next = getInitialVnState(b.scenes, m);
    setState(next);
    saveState(next);
  }, [storyRev]);

  const getSpeaker = useCallback(
    (speakerId?: string) => (speakerId ? charById.get(speakerId) : undefined),
    [charById]
  );

  const dispatch = useCallback(
    (intent: VnIntent) => {
      setState((prev) => {
        const scene = scenesById.get(prev.currentSceneId) ?? scenes[0];
        if (!scene) {
          return prev;
        }
        const line = scene.lines[prev.lineIndex] ?? null;
        let next = prev;

        const goToScene = (
          base: VnState,
          targetSceneId: string,
          flags: Record<string, true>,
          reveals: VnState["reveals"]
        ): VnState => {
          const targetScene =
            scenesById.get(targetSceneId) ?? scenes[0] ?? EMPTY_SCENE;
          const initialIndex = nextVisibleLineIndex(targetScene, 0, flags) ?? 0;
          return {
            ...base,
            currentSceneId: targetScene.id,
            lineIndex: initialIndex,
            flags,
            reveals: applyRevealActions(
              reveals,
              lineAt(targetScene.id, initialIndex, scenesById)?.unlocks
            ),
            interaction: interactionStateForLine(
              targetScene.id,
              initialIndex,
              scenesById
            ),
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
              lineAt(fromScene.id, nextLineIndex, scenesById)?.unlocks
            ),
            interaction: interactionStateForLine(
              fromScene.id,
              nextLineIndex,
              scenesById
            ),
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
            if (!picked || !scenesById.has(picked.nextSceneId)) return prev;
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
            if (!line?.interaction || line.interaction.kind !== "mcq")
              return prev;
            const lk = interactionKey(scene.id, prev.lineIndex);
            const selected =
              prev.interaction.lineKey === lk
                ? (prev.interaction.selectedOptionIds ?? [])
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
              // One-time MCQ: allow changing selection before submit.
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
            if (!line?.interaction || line.interaction.kind !== "accuse")
              return prev;
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
              prev.interaction.lineKey ===
              interactionKey(scene.id, prev.lineIndex)
                ? (prev.interaction.selectedOptionIds ?? [])
                : [];
            const selectedProfile =
              prev.interaction.lineKey ===
              interactionKey(scene.id, prev.lineIndex)
                ? prev.interaction.selectedProfileId
                : undefined;

            if (line.interaction.kind === "mcq") {
              const lastSelectedId = selectedOptions[selectedOptions.length - 1];
              if (!lastSelectedId) return prev;
              const selected = line.interaction.options.find(
                (o) => o.id === lastSelectedId
              );
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
              if (
                !isCorrect &&
                line.interaction.redoable &&
                !outcome?.nextSceneId
              ) {
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
            const isCorrect =
              selectedProfile === line.interaction.correctProfileId;
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
            if (!scenesById.has(intent.sceneId)) return prev;
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
    [getSpeaker, scenes, scenesById]
  );

  const reset = useCallback(() => {
    const b = loadStoryBundle();
    const m = new Map(b.scenes.map((s) => [s.id, s]));
    const next = getInitialVnState(b.scenes, m);
    setState(next);
    saveState(next);
  }, []);

  const currentScene = scenesById.get(state.currentSceneId) ?? scenes[0] ?? EMPTY_SCENE;
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
      scenes,
      characters,
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
      scenes,
      characters,
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
