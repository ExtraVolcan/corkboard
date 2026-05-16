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
  /**
   * After a wrong submit, shown briefly before returning to the question.
   * If omitted, a generic line is used.
   */
  wrongFeedback?: string;
  /** Speaker nameplate for wrongFeedback (defaults to narrator). */
  wrongFeedbackSpeakerId?: string;
};

export type VnMcqInteraction = {
  kind: "mcq";
  prompt: string;
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

/**
 * Player opens the corkboard on a fixed profile, selects one intel entry, and submits.
 * Wrong answers use the same brief overlay as MCQ (`mcqWrongFeedback`).
 */
export type VnCorkboardEntryInteraction = {
  kind: "corkboardEntry";
  /** Shown in the dialogue box above the open-corkboard button. */
  prompt?: string;
  /** Large persistent banner (VN + corkboard + profile). */
  question: string;
  /** Only this dossier is available; player cannot leave it until correct or dimiss wrong feedback. */
  profileId: string;
  correctEntryId: string;
  openBoardButtonLabel?: string;
  submitLabel?: string;
  /** Fallback when the chosen entry has no `wrongFeedbackByEntryId` entry. */
  wrongFeedbackDefault?: string;
  wrongFeedbackSpeakerId?: string;
  /** Per wrong entry id (seed `entries[].id`). */
  wrongFeedbackByEntryId?: Record<string, string>;
  onCorrect?: VnInteractionOutcome;
  onIncorrect?: VnInteractionOutcome;
};

export type VnLineInteraction =
  | VnMcqInteraction
  | VnAccuseInteraction
  | VnCorkboardEntryInteraction;

export type VnRevealAction =
  | { type: "revealProfile"; profileId: string }
  | { type: "revealName"; profileId: string }
  | { type: "revealImage"; profileId: string }
  | { type: "revealEntry"; profileId: string; entryId: string }
  /**
   * Corkboard / dossier caption only (does not change server campaign JSON).
   * When set, shown whenever the profile card is visible, even before revealName.
   */
  | { type: "setProfileDisplayName"; profileId: string; displayName: string };

export type VnLine = {
  speakerId?: string;
  /** Optional author-facing portrait id, e.g. "portrait:detective-default" */
  portraitId?: string;
  /**
   * Outline for sprite / expression (e.g. "neutral", "worried").
   * Resolved as `VN_PORTRAITS["{speakerId}-{emotion}"]` when assets exist.
   */
  emotion?: string;
  /**
   * When true, this line only updates portraits (and flags/unlocks); no dialogue is shown and
   * no speaker highlight. Use `text: ""` and `speakerId` + `emotion` or `portraitId` to set a
   * background character’s expression while another line is “foreground.”
   */
  portraitOnly?: boolean;
  /** Overrides scene background from this line onward (same `bg:` ids or raw CSS as scene.background). */
  background?: string;
  text: string;
  choices?: VnChoice[];
  interaction?: VnLineInteraction;
  unlocks?: VnRevealAction[];
  requireFlags?: string[];
  setFlags?: string[];
  /**
   * Spotlight the corkboard toolbar icon and block advance until the player opens
   * the corkboard once (sets {@link CORKBOARD_TUTORIAL_OPENED_FLAG}).
   */
  corkboardTutorial?: boolean;
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
  /** Player score earned from correctly answering questions. */
  points: number;
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
  /** Story-local labels for corkboard polaroids & dossiers (see setProfileDisplayName unlock). */
  profileDisplayNames: Record<string, string>;
  interaction: {
    lineKey?: string;
    selectedOptionIds?: string[];
    selectedProfileId?: string;
  };
  /** Brief overlay after an incorrect MCQ submit (same lineKey as the MCQ line). */
  mcqWrongFeedback?: {
    lineKey: string;
    text: string;
    speakerId?: string;
  };
};

/** Set when the player opens the corkboard during a `corkboardTutorial` line. */
export const CORKBOARD_TUTORIAL_OPENED_FLAG = "tutorial_corkboard_opened";

export function isCorkboardTutorialGateActive(
  line: Pick<VnLine, "corkboardTutorial"> | null | undefined,
  flags: Record<string, true>
): boolean {
  return Boolean(
    line?.corkboardTutorial && !flags[CORKBOARD_TUTORIAL_OPENED_FLAG]
  );
}

export type VnIntent =
  | { type: "advanceDialogue" }
  | { type: "acknowledgeCorkboardTutorial" }
  | { type: "skipToNextInteraction" }
  | { type: "chooseOption"; optionId: string }
  | { type: "selectInteractionOption"; optionId: string }
  | { type: "selectEvidenceEntry"; profileId: string; entryId: string }
  | { type: "selectAccusedProfile"; profileId: string }
  | { type: "submitInteraction" }
  | { type: "goToScene"; sceneId: string }
  | { type: "setTextSpeed"; value: number }
  | { type: "setAutoAdvance"; value: boolean };
