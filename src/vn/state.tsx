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
import {
  canonicalSpeakerId,
  resolveSpeakerDisplayLabel,
} from "./speakerLabel";
import { preloadRegisteredVnPortraits } from "./assets";

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

/** Flag set when the player submitted this MCQ option and it was wrong (option stays disabled). */
export function mcqEliminatedFlagKey(
  sceneId: string,
  lineIndex: number,
  optionId: string
): string {
  return `vnMcqElim_${sceneId}_${lineIndex}_${optionId}`;
}

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
      points: 0,
      settings: { textSpeed: 60, autoAdvance: false },
      flags: {},
      reveals: {},
      profileDisplayNames: {},
      interaction: {},
    };
  }
  const firstLine = first.lines[0]!;
  const initialUnlock = mergeUnlockState({}, {}, firstLine.unlocks);
  const initialFlags = withSetFlags({}, firstLine.setFlags);
  return absorbPortraitOnlyPrefix(
    first,
    {
      currentSceneId: first.id,
      lineIndex: 0,
      history: [],
      points: 0,
      settings: { textSpeed: 60, autoAdvance: false },
      flags: initialFlags,
      reveals: initialUnlock.reveals,
      profileDisplayNames: initialUnlock.profileDisplayNames,
      interaction: interactionStateForLine(first.id, 0, scenesById),
    },
    scenesById
  );
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
      points:
        typeof parsed.points === "number"
          ? parsed.points
          : base.points,
      settings: { ...base.settings, ...parsed.settings },
      flags: parsed.flags ?? base.flags,
      reveals: parsed.reveals ?? base.reveals,
      profileDisplayNames:
        parsed.profileDisplayNames ?? base.profileDisplayNames,
      interaction: parsed.interaction ?? base.interaction,
      mcqWrongFeedback: parsed.mcqWrongFeedback,
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
      case "setProfileDisplayName":
        break;
    }
    if (item !== prev) next[a.profileId] = item;
  }
  return changed ? next : reveals;
}

function mergeUnlockState(
  reveals: VnState["reveals"],
  profileDisplayNames: Record<string, string>,
  unlocks?: VnRevealAction[]
): {
  reveals: VnState["reveals"];
  profileDisplayNames: Record<string, string>;
} {
  const nextReveals = applyRevealActions(reveals, unlocks);
  if (!unlocks?.some((a) => a.type === "setProfileDisplayName")) {
    return { reveals: nextReveals, profileDisplayNames };
  }
  const nextNames = { ...profileDisplayNames };
  for (const a of unlocks) {
    if (a.type === "setProfileDisplayName") {
      if (a.displayName === "") delete nextNames[a.profileId];
      else nextNames[a.profileId] = a.displayName;
    }
  }
  return { reveals: nextReveals, profileDisplayNames: nextNames };
}

/** Skip leading portrait-only beats so the player never “stops” on an empty dialogue line. */
function absorbPortraitOnlyPrefix(
  scene: VnScene,
  st: VnState,
  scenesById: Map<string, VnScene>
): VnState {
  let idx = st.lineIndex;
  let f = st.flags;
  let r = st.reveals;
  let p = st.profileDisplayNames;
  while (idx < scene.lines.length) {
    const ln = scene.lines[idx];
    if (!ln?.portraitOnly) break;
    if (!hasRequiredFlags(f, ln.requireFlags)) break;
    const m = mergeUnlockState(r, p, ln.unlocks);
    r = m.reveals;
    p = m.profileDisplayNames;
    f = withSetFlags(f, ln.setFlags);
    const n2 = nextVisibleLineIndex(scene, idx + 1, f);
    if (n2 == null) {
      return {
        ...st,
        lineIndex: idx,
        flags: f,
        reveals: r,
        profileDisplayNames: p,
        interaction: {},
        mcqWrongFeedback: undefined,
      };
    }
    idx = n2;
  }
  return {
    ...st,
    lineIndex: idx,
    flags: f,
    reveals: r,
    profileDisplayNames: p,
    interaction: interactionStateForLine(scene.id, idx, scenesById),
    mcqWrongFeedback: undefined,
  };
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
    void preloadRegisteredVnPortraits();
  }, [storyRev]);

  useEffect(() => {
    if (storyRev === 0) return;
    const b = loadStoryBundle();
    const m = new Map(b.scenes.map((s) => [s.id, s]));
    const next = getInitialVnState(b.scenes, m);
    setState(next);
    saveState(next);
  }, [storyRev]);

  const getSpeaker = useCallback(
    (speakerId?: string) => {
      if (!speakerId) return undefined;
      return (
        charById.get(canonicalSpeakerId(speakerId)) ??
        charById.get(speakerId)
      );
    },
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
          flags: Record<string, true>
        ): VnState => {
          const targetScene =
            scenesById.get(targetSceneId) ?? scenes[0] ?? EMPTY_SCENE;
          const initialIndex = nextVisibleLineIndex(targetScene, 0, flags) ?? 0;
          const atTarget = mergeUnlockState(
            base.reveals,
            base.profileDisplayNames,
            lineAt(targetScene.id, initialIndex, scenesById)?.unlocks
          );
          return absorbPortraitOnlyPrefix(
            targetScene,
            {
              ...base,
              currentSceneId: targetScene.id,
              lineIndex: initialIndex,
              flags,
              reveals: atTarget.reveals,
              profileDisplayNames: atTarget.profileDisplayNames,
              interaction: interactionStateForLine(
                targetScene.id,
                initialIndex,
                scenesById
              ),
              mcqWrongFeedback: undefined,
            },
            scenesById
          );
        };

        const goNextLine = (
          base: VnState,
          fromScene: VnScene,
          flags: Record<string, true>
        ): VnState => {
          const firstNext = nextVisibleLineIndex(
            fromScene,
            base.lineIndex + 1,
            flags
          );
          if (firstNext == null) {
            return {
              ...base,
              flags,
              interaction: {},
              mcqWrongFeedback: undefined,
            };
          }
          let idx = firstNext;
          let f = flags;
          let r = base.reveals;
          let p = base.profileDisplayNames;
          while (true) {
            const ln = fromScene.lines[idx]!;
            if (!hasRequiredFlags(f, ln.requireFlags)) {
              return {
                ...base,
                lineIndex: idx,
                flags: f,
                reveals: r,
                profileDisplayNames: p,
                interaction: interactionStateForLine(
                  fromScene.id,
                  idx,
                  scenesById
                ),
                mcqWrongFeedback: undefined,
              };
            }
            const m = mergeUnlockState(r, p, ln.unlocks);
            r = m.reveals;
            p = m.profileDisplayNames;
            f = withSetFlags(f, ln.setFlags);
            if (!ln.portraitOnly) {
              return {
                ...base,
                lineIndex: idx,
                flags: f,
                reveals: r,
                profileDisplayNames: p,
                interaction: interactionStateForLine(
                  fromScene.id,
                  idx,
                  scenesById
                ),
                mcqWrongFeedback: undefined,
              };
            }
            const n2 = nextVisibleLineIndex(fromScene, idx + 1, f);
            if (n2 == null) {
              return {
                ...base,
                lineIndex: idx,
                flags: f,
                reveals: r,
                profileDisplayNames: p,
                interaction: {},
                mcqWrongFeedback: undefined,
              };
            }
            idx = n2;
          }
        };

        switch (intent.type) {
          case "advanceDialogue": {
            if (!line) return prev;
            const lkAdv = interactionKey(scene.id, prev.lineIndex);
            if (prev.mcqWrongFeedback?.lineKey === lkAdv) {
              const fb = prev.mcqWrongFeedback;
              const historyName =
                resolveSpeakerDisplayLabel(fb.speakerId, charById, {
                  flags: prev.flags,
                  reveals: prev.reveals,
                }) ?? "";
              const history = pushHistory(
                prev.history,
                scene.id,
                historyName,
                fb.text
              );
              next = { ...prev, history, mcqWrongFeedback: undefined };
              break;
            }
            if (line.choices?.length) return prev;
            if (line.interaction) return prev;

            const afterLineFlags = withSetFlags(prev.flags, line.setFlags);
            const afterUnlock = mergeUnlockState(
              prev.reveals,
              prev.profileDisplayNames,
              line.unlocks
            );

            if (line.portraitOnly) {
              next = goNextLine(
                {
                  ...prev,
                  reveals: afterUnlock.reveals,
                  profileDisplayNames: afterUnlock.profileDisplayNames,
                },
                scene,
                afterLineFlags
              );
              break;
            }

            const historyName =
              resolveSpeakerDisplayLabel(line.speakerId, charById, {
                flags: prev.flags,
                reveals: prev.reveals,
              }) ?? "";
            const history = pushHistory(
              prev.history,
              scene.id,
              historyName,
              line.text
            );

            next = goNextLine(
              {
                ...prev,
                history,
                reveals: afterUnlock.reveals,
                profileDisplayNames: afterUnlock.profileDisplayNames,
              },
              scene,
              afterLineFlags
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
            const historyName =
              resolveSpeakerDisplayLabel(line.speakerId, charById, {
                flags: prev.flags,
                reveals: prev.reveals,
              }) ?? "";
            const withChoice = pushHistory(
              prev.history,
              scene.id,
              historyName,
              `${line.text} [${picked.label}]`
            );
            const withFlags = withSetFlags(prev.flags, [
              ...(line.setFlags ?? []),
              ...(picked.setFlags ?? []),
            ]);
            const afterUnlock = mergeUnlockState(
              prev.reveals,
              prev.profileDisplayNames,
              line.unlocks
            );
            next = goToScene(
              {
                ...prev,
                history: withChoice,
                reveals: afterUnlock.reveals,
                profileDisplayNames: afterUnlock.profileDisplayNames,
              },
              picked.nextSceneId,
              withFlags
            );
            break;
          }
          case "selectInteractionOption": {
            if (!line?.interaction || line.interaction.kind !== "mcq")
              return prev;
            const lk = interactionKey(scene.id, prev.lineIndex);
            next = {
              ...prev,
              interaction: {
                lineKey: lk,
                selectedOptionIds: [intent.optionId],
                selectedProfileId: prev.interaction.selectedProfileId,
              },
            };
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

            const POINTS_CORRECT = 10;
            const POINTS_INCORRECT = 5;

            if (line.interaction.kind === "mcq") {
              const selId = selectedOptions[0];
              if (!selId) return prev;
              const selected = line.interaction.options.find(
                (o) => o.id === selId
              );
              if (!selected) return prev;
              const isCorrect = selected.correct === true;
              const outcome = isCorrect
                ? (selected.outcome ?? line.interaction.onCorrect)
                : (selected.outcome ?? line.interaction.onIncorrect);
              const nextPoints = Math.max(
                0,
                prev.points +
                  (isCorrect ? POINTS_CORRECT : -POINTS_INCORRECT)
              );
              const lkMcq = interactionKey(scene.id, prev.lineIndex);
              const elimKey = mcqEliminatedFlagKey(
                scene.id,
                prev.lineIndex,
                selId
              );
              const flagsAfterLineSet = withSetFlags(prev.flags, line.setFlags);
              const flagsWithElimIfWrong = !isCorrect
                ? withSetFlags(flagsAfterLineSet, [elimKey])
                : flagsAfterLineSet;
              const afterUnlock = mergeUnlockState(
                prev.reveals,
                prev.profileDisplayNames,
                line.unlocks
              );

              if (!isCorrect && !outcome?.nextSceneId) {
                const wrongFbRaw =
                  selected.wrongFeedback?.trim() || "Not quite—try another angle.";
                const wrongFbSpeaker =
                  selected.wrongFeedbackSpeakerId ?? "narrator";
                const flagsAfterWrong = withSetFlags(
                  flagsWithElimIfWrong,
                  outcome?.setFlags
                );
                next = {
                  ...prev,
                  points: nextPoints,
                  flags: flagsAfterWrong,
                  mcqWrongFeedback: {
                    lineKey: lkMcq,
                    text: wrongFbRaw,
                    speakerId: wrongFbSpeaker,
                  },
                  interaction: {
                    lineKey: lkMcq,
                    selectedOptionIds: [],
                    selectedProfileId: prev.interaction.selectedProfileId,
                  },
                };
                break;
              }

              const withFlags = withSetFlags(
                flagsWithElimIfWrong,
                outcome?.setFlags
              );
              const withHistory = pushHistory(
                prev.history,
                scene.id,
                "Choice",
                `${line.interaction.prompt} -> ${selected.label}`
              );
              if (outcome?.nextSceneId) {
                next = goToScene(
                  {
                    ...prev,
                    history: withHistory,
                    points: nextPoints,
                    reveals: afterUnlock.reveals,
                    profileDisplayNames: afterUnlock.profileDisplayNames,
                  },
                  outcome.nextSceneId,
                  withFlags
                );
                break;
              }
              next = goNextLine(
                {
                  ...prev,
                  history: withHistory,
                  points: nextPoints,
                  reveals: afterUnlock.reveals,
                  profileDisplayNames: afterUnlock.profileDisplayNames,
                },
                scene,
                withFlags
              );
              break;
            }

            if (!selectedProfile) return prev;
            const isCorrect =
              selectedProfile === line.interaction.correctProfileId;
            const outcome = isCorrect
              ? line.interaction.onCorrect
              : line.interaction.onIncorrect;
            const nextPoints = Math.max(
              0,
              prev.points +
                (isCorrect ? POINTS_CORRECT : -POINTS_INCORRECT)
            );
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
            const afterUnlockAccuse = mergeUnlockState(
              prev.reveals,
              prev.profileDisplayNames,
              line.unlocks
            );
            if (outcome?.nextSceneId) {
              next = goToScene(
                {
                  ...prev,
                  history: withHistory,
                  points: nextPoints,
                  reveals: afterUnlockAccuse.reveals,
                  profileDisplayNames: afterUnlockAccuse.profileDisplayNames,
                },
                outcome.nextSceneId,
                withFlags
              );
              break;
            }
            next = goNextLine(
              {
                ...prev,
                history: withHistory,
                points: nextPoints,
                reveals: afterUnlockAccuse.reveals,
                profileDisplayNames: afterUnlockAccuse.profileDisplayNames,
              },
              scene,
              withFlags
            );
            break;
          }
          case "skipToNextInteraction": {
            let st = prev;
            for (let iter = 0; iter < 4000; iter++) {
              const sc = scenesById.get(st.currentSceneId) ?? scenes[0];
              if (!sc) break;
              const curLine = sc.lines[st.lineIndex] ?? null;
              const lkSkip = interactionKey(sc.id, st.lineIndex);

              if (st.mcqWrongFeedback?.lineKey === lkSkip) {
                const fb = st.mcqWrongFeedback;
                const historyName =
                  resolveSpeakerDisplayLabel(fb.speakerId, charById, {
                    flags: st.flags,
                    reveals: st.reveals,
                  }) ?? "";
                st = {
                  ...st,
                  history: pushHistory(
                    st.history,
                    sc.id,
                    historyName,
                    fb.text
                  ),
                  mcqWrongFeedback: undefined,
                };
                continue;
              }

              if (!curLine) break;
              if (curLine.choices?.length || curLine.interaction) break;

              const beforePos = `${st.currentSceneId}:${st.lineIndex}`;

              const afterLineFlags = withSetFlags(st.flags, curLine.setFlags);
              const afterUnlock = mergeUnlockState(
                st.reveals,
                st.profileDisplayNames,
                curLine.unlocks
              );

              if (curLine.portraitOnly) {
                st = goNextLine(
                  {
                    ...st,
                    reveals: afterUnlock.reveals,
                    profileDisplayNames: afterUnlock.profileDisplayNames,
                  },
                  sc,
                  afterLineFlags
                );
              } else {
                const historyName =
                  resolveSpeakerDisplayLabel(curLine.speakerId, charById, {
                    flags: st.flags,
                    reveals: st.reveals,
                  }) ?? "";
                const history = pushHistory(
                  st.history,
                  sc.id,
                  historyName,
                  curLine.text
                );
                st = goNextLine(
                  {
                    ...st,
                    history,
                    reveals: afterUnlock.reveals,
                    profileDisplayNames: afterUnlock.profileDisplayNames,
                  },
                  sc,
                  afterLineFlags
                );
              }

              const afterPos = `${st.currentSceneId}:${st.lineIndex}`;
              if (beforePos === afterPos) break;
            }
            next = st;
            break;
          }
          case "goToScene": {
            if (!scenesById.has(intent.sceneId)) return prev;
            next = goToScene(prev, intent.sceneId, prev.flags);
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
    [getSpeaker, scenes, scenesById, charById]
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
