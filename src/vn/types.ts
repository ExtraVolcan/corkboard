export type VnCharacter = {
  id: string;
  name: string;
  accent?: string;
};

export type VnChoice = {
  id: string;
  label: string;
  nextSceneId: string;
};

export type VnLine = {
  speakerId?: string;
  text: string;
  choices?: VnChoice[];
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
};

export type VnIntent =
  | { type: "advanceDialogue" }
  | { type: "chooseOption"; optionId: string }
  | { type: "goToScene"; sceneId: string }
  | { type: "setTextSpeed"; value: number }
  | { type: "setAutoAdvance"; value: boolean };
