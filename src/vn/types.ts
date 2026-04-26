export type VnCharacter = {
  id: string;
  name: string;
  accent?: string;
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
