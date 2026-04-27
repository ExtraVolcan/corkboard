export type VnCharacter = {
  id: string;
  /** Shown when the character's name is "known" (see flags / linkedProfileId). */
  name: string;
  accent?: string;
  /** If true, no nameplate is shown (narration / interior monologue). */
  hideSpeakerLabel?: boolean;
  /** Nameplate text before the player learns the real name (default "???"; "" shows blank). */
  unknownName?: string;
  /** When set, `name` is shown after this flag appears on VN state (via unlock / outcomes). */
  nameRevealFlag?: string;
  /** When set, `name` is shown once corkboard profile name or VN name reveal unlocks. */
  linkedProfileId?: string;
};

export type VnChoice = {
  id: string;
  label: string;
  nextSceneId: string;
  requireFlags?: string[];
  setFlags?: string[];
};

export type VnInteractionOutcome = {
  nextSceneId?: string;
  setFlags?: string[];
};

export type VnMcqOption = {
  id: string;
  label: string;
  correct?: boolean;
  outcome?: VnInteractionOutcome;
};

export type VnMcqInteraction = {
  kind: "mcq";
  prompt: string;
  redoable: boolean;
  options: VnMcqOption[];
  onCorrect?: VnInteractionOutcome;
  onIncorrect?: VnInteractionOutcome;
};

export type VnAccuseInteraction = {
  kind: "accuse";
  prompt: string;
  correctProfileId: string;
  submitLabel?: string;
  onCorrect?: VnInteractionOutcome;
  onIncorrect?: VnInteractionOutcome;
};

export type VnLineInteraction = VnMcqInteraction | VnAccuseInteraction;

export type VnRevealAction =
  | { type: "revealProfile"; profileId: string }
  | { type: "revealName"; profileId: string }
  | { type: "revealImage"; profileId: string }
  | { type: "revealEntry"; profileId: string; entryId: string };

export type VnLine = {
  speakerId?: string;
  /** Optional author-facing portrait id, e.g. "portrait:detective-default" */
  portraitId?: string;
  /**
   * Outline for sprite / expression (e.g. "neutral", "worried").
   * Resolved as `VN_PORTRAITS["{speakerId}-{emotion}"]` when assets exist.
   */
  emotion?: string;
  /** Overrides scene background from this line onward (same `bg:` ids or raw CSS as scene.background). */
  background?: string;
  text: string;
  choices?: VnChoice[];
  interaction?: VnLineInteraction;
  unlocks?: VnRevealAction[];
  requireFlags?: string[];
  setFlags?: string[];
};

export type VnScene = {
  id: string;
  title: string;
  background: string;
  lines: VnLine[];
};

export type VnHistoryEntry = {
  sceneId: string;
  speakerName: string;
  text: string;
  atMs: number;
};

export type VnSettings = {
  textSpeed: number;
  autoAdvance: boolean;
};

export type VnState = {
  currentSceneId: string;
  lineIndex: number;
  history: VnHistoryEntry[];
  settings: VnSettings;
  flags: Record<string, true>;
  reveals: Record<
    string,
    {
      profile?: true;
      name?: true;
      image?: true;
      entries?: Record<string, true>;
    }
  >;
  interaction: {
    lineKey?: string;
    selectedOptionIds?: string[];
    selectedProfileId?: string;
  };
};

export type VnIntent =
  | { type: "advanceDialogue" }
  | { type: "chooseOption"; optionId: string }
  | { type: "selectInteractionOption"; optionId: string }
  | { type: "selectAccusedProfile"; profileId: string }
  | { type: "submitInteraction" }
  | { type: "goToScene"; sceneId: string }
  | { type: "setTextSpeed"; value: number }
  | { type: "setAutoAdvance"; value: boolean };
