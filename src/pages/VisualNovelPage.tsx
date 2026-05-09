import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CorkboardModal } from "../components/CorkboardModal";
import { ProfileModal } from "../components/ProfileModal";
import { loadSfxPrefs, playSfx, saveSfxPrefs, type SfxPrefs } from "../audio/sfx";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";
import { mergeProfilesWithSeed } from "../campaignSeedFallback";
import { corkboardHasUnreadIntel } from "../newBadges";
import {
  portraitRegistryHint,
  resolveBackground,
  resolveEffectiveSceneBackground,
  resolvePortraitForSnapshot,
} from "../vn/assets";
import {
  buildPortraitLayout,
  resolvePortraitHighlightSpeakerId,
} from "../vn/portraitLayout";
import {
  resolveSpeakerDisplayLabel,
  resolveSpeakerPlaceholderInitial,
} from "../vn/speakerLabel";
import { polaroidCaptionFromCampaign } from "../vn/boardProfileLabel";
import { mcqEliminatedFlagKey, useVn } from "../vn/state";
import { useTypewriterLine } from "../vn/useTypewriterLine";
import type { PortraitSlot } from "../vn/portraitLayout";
import type { SpeakerLabelContext } from "../vn/speakerLabel";
import type { VnCharacter, VnState } from "../vn/types";
import type { Profile } from "../types";

function revealsIncreased(
  prev: VnState["reveals"],
  next: VnState["reveals"]
): boolean {
  const ids = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const pid of ids) {
    const pPrev = prev[pid];
    const pNext = next[pid];
    if (!pPrev && pNext) {
      if (
        pNext.profile ||
        pNext.name ||
        pNext.image ||
        Object.keys(pNext.entries ?? {}).some((eid) => pNext.entries?.[eid])
      ) {
        return true;
      }
      continue;
    }
    if (!pNext) continue;
    if (!pPrev?.profile && pNext.profile) return true;
    if (!pPrev?.name && pNext.name) return true;
    if (!pPrev?.image && pNext.image) return true;
    const ePrev = pPrev?.entries ?? {};
    const eNext = pNext.entries ?? {};
    for (const eid of Object.keys(eNext)) {
      if (eNext[eid] && !ePrev[eid]) return true;
    }
  }
  return false;
}

function PortraitFigure({
  slot,
  charById,
  speakerLabelCtx,
  campaignProfiles,
  isImageVisible,
}: {
  slot: PortraitSlot;
  charById: Map<string, VnCharacter>;
  speakerLabelCtx: SpeakerLabelContext;
  campaignProfiles: Profile[];
  isImageVisible: (profileId: string) => boolean;
}) {
  const speaker = charById.get(slot.speakerId);
  const accent = speaker?.accent || "#a8a29e";
  const letter = resolveSpeakerPlaceholderInitial(
    slot.speakerId,
    charById,
    speakerLabelCtx
  );
  const label =
    resolveSpeakerDisplayLabel(slot.speakerId, charById, speakerLabelCtx) ?? "";
  const assetUrl = resolvePortraitForSnapshot({
    speakerId: slot.speakerId,
    emotion: slot.emotion,
    portraitId: slot.portraitId,
  });
  const profile = campaignProfiles.find((p) => p.id === slot.speakerId);
  const profileUrl =
    profile && (profile.imageRevealed || isImageVisible(profile.id))
      ? profile.image
      : null;
  const resolvedArt = assetUrl ?? profileUrl;
  const src = resolvedArt ?? placeholderArt(letter, accent);
  const registryHint = portraitRegistryHint({
    speakerId: slot.speakerId,
    emotion: slot.emotion,
  });
  const showPlaceholderEmotionHint = Boolean(!resolvedArt && registryHint);

  return (
    <div
      className={`vn-portrait-slot${
        slot.isSpeaking ? "" : " vn-portrait-slot--inactive"
      }`}
    >
      <div className="vn-portrait-figure-wrap">
        <img
          className="vn-portrait"
          src={src}
          alt={label ? `${label} portrait` : ""}
        />
        {showPlaceholderEmotionHint ? (
          <div className="vn-portrait-emotion-hint" aria-hidden>
            <span className="vn-portrait-emotion-hint-label">{registryHint}</span>
          </div>
        ) : null}
      </div>
      {slot.emotion && !showPlaceholderEmotionHint ? (
        <span className="vn-emotion-outline">{slot.emotion}</span>
      ) : null}
    </div>
  );
}

function IconHistory() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6.5 6.5L3 10" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconCorkboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="11" width="7" height="10" rx="1" />
      <rect x="3" y="15" width="7" height="6" rx="1" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.4l.1.1a2 2 0 0 1-2.5 2.5l-.1-.1a1.7 1.7 0 0 0-1.4-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.4.3h-.1a2 2 0 0 1-2.5-2.5l.1-.1a1.7 1.7 0 0 0 .3-1.4 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.7 7h.1a2 2 0 0 1 2.5-2.5h.1a1.7 1.7 0 0 0 1.4.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.4-.3h.1a2 2 0 0 1 2.5 2.5l-.1.1a1.7 1.7 0 0 0-.3 1.4 1.7 1.7 0 0 0 1.6 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function placeholderArt(letter: string, accent: string): string {
  const body = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2a2018"/><stop offset="100%" stop-color="#0f0c0a"/></linearGradient></defs><rect width="360" height="480" fill="url(#g)" rx="20" stroke="rgba(255,255,255,0.08)"/><text x="180" y="268" text-anchor="middle" font-size="120" font-family="Georgia,serif" fill="${accent}">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(body)}`;
}

export function VisualNovelPage() {
  const { isAdmin } = useAuth();
  const { data, ack, clearAck } = useCampaign();
  const [searchParams, setSearchParams] = useSearchParams();
  const showCorkboard = searchParams.get("board") === "1";
  const profileParamRaw = searchParams.get("profile");
  const profileModalId =
    profileParamRaw && profileParamRaw.trim() ? profileParamRaw.trim() : null;
  const {
    state,
    currentScene,
    currentLine,
    dispatch,
    reset,
    characters,
    getSpeaker,
    isProfileVisible,
    isNameVisible,
    isImageVisible,
    isEntryVisible,
  } = useVn();
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [corkboardToast, setCorkboardToast] = useState(false);
  const [sfxPrefs, setSfxPrefs] = useState<SfxPrefs>(() => loadSfxPrefs());
  const prevRevealsRef = useRef<VnState["reveals"] | null>(null);
  const historyListRef = useRef<HTMLDivElement>(null);

  function openCorkboard() {
    playSfx("panel", sfxPrefs);
    setSearchParams(
      (p) => {
        const n = new URLSearchParams(p);
        n.set("board", "1");
        return n;
      },
      { replace: true }
    );
  }

  function closeCorkboard() {
    playSfx("panel", sfxPrefs);
    setSearchParams(
      (p) => {
        const n = new URLSearchParams(p);
        n.delete("board");
        return n;
      },
      { replace: true }
    );
  }

  const stripProfileParam = useCallback(() => {
    setSearchParams(
      (p) => {
        const n = new URLSearchParams(p);
        n.delete("profile");
        return n;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const closeProfileUi = useCallback(() => {
    playSfx("panel", sfxPrefs);
    stripProfileParam();
  }, [sfxPrefs, stripProfileParam]);

  useEffect(() => {
    if (prevRevealsRef.current === null) {
      prevRevealsRef.current = state.reveals;
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (revealsIncreased(prevRevealsRef.current, state.reveals)) {
      setCorkboardToast(true);
      timer = setTimeout(() => setCorkboardToast(false), 4200);
    }
    prevRevealsRef.current = state.reveals;
    return () => {
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [state.reveals]);

  const vnRevealGate = useMemo(
    () => ({
      isProfileVisible,
      isNameVisible,
      isImageVisible,
      isEntryVisible,
    }),
    [isProfileVisible, isNameVisible, isImageVisible, isEntryVisible]
  );

  const corkboardHasUnread = useMemo(() => {
    const catalog = mergeProfilesWithSeed(data.profiles);
    return corkboardHasUnreadIntel(catalog, ack, isAdmin, vnRevealGate);
  }, [data.profiles, ack, isAdmin, vnRevealGate]);

  useEffect(() => {
    if (!showHistory) return;
    const el = historyListRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [showHistory, state.history.length]);

  useEffect(() => {
    if (
      !showHistory &&
      !showSettings &&
      !showCorkboard &&
      !profileModalId
    ) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setShowHistory(false);
      setShowSettings(false);
      if (profileModalId) {
        stripProfileParam();
        return;
      }
      if (showCorkboard) {
        setSearchParams(
          (p) => {
            const n = new URLSearchParams(p);
            n.delete("board");
            return n;
          },
          { replace: true }
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    showHistory,
    showSettings,
    showCorkboard,
    profileModalId,
    stripProfileParam,
    setSearchParams,
  ]);

  const speaker = getSpeaker(currentLine?.speakerId);
  const charById = useMemo(
    () => new Map(characters.map((c) => [c.id, c])),
    [characters]
  );
  const campaignProfileMeta = useMemo(
    () =>
      data.profiles.map((p) => ({
        id: p.id,
        nameRevealed: p.nameRevealed,
      })),
    [data.profiles]
  );
  const speakerLabelCtx = useMemo(
    () => ({
      flags: state.flags,
      reveals: state.reveals,
      campaignProfiles: campaignProfileMeta,
    }),
    [state.flags, state.reveals, campaignProfileMeta]
  );
  const speakerDisplayLabel = useMemo(
    () =>
      resolveSpeakerDisplayLabel(
        currentLine?.speakerId,
        charById,
        speakerLabelCtx
      ),
    [currentLine?.speakerId, charById, speakerLabelCtx]
  );
  const visibleChoices =
    currentLine?.choices?.filter(
      (c) => !c.requireFlags?.length || c.requireFlags.every((f) => state.flags[f])
    ) ?? [];
  const hasChoices = visibleChoices.length > 0;
  const interaction = currentLine?.interaction;
  const interactionLineKey = `${currentScene.id}::${state.lineIndex}`;
  const selectedOptionIds =
    state.interaction.lineKey === interactionLineKey
      ? state.interaction.selectedOptionIds ?? []
      : [];
  const selectedProfileId =
    state.interaction.lineKey === interactionLineKey
      ? state.interaction.selectedProfileId
      : undefined;

  const mcqWrongFeedback = state.mcqWrongFeedback;
  const showingMcqWrongFeedback = Boolean(
    interaction?.kind === "mcq" &&
      mcqWrongFeedback?.lineKey === interactionLineKey
  );
  const mcqFbSpeakerId = mcqWrongFeedback?.speakerId ?? "narrator";
  const mcqFbSpeakerLabel = showingMcqWrongFeedback
    ? resolveSpeakerDisplayLabel(mcqFbSpeakerId, charById, speakerLabelCtx)
    : null;
  const mcqFbSpeakerStyle = showingMcqWrongFeedback
    ? getSpeaker(mcqFbSpeakerId)
    : undefined;

  const accuseCandidates = useMemo(
    () =>
      data.profiles.filter((p) => {
        const profileOpen = p.profileRevealed || isProfileVisible(p.id);
        const nameOpen = p.nameRevealed || isNameVisible(p.id);
        const caption = polaroidCaptionFromCampaign(
          p.name,
          state.profileDisplayNames,
          p.id,
          {
            profileVisible: profileOpen,
            nameVisible: nameOpen,
            campaignNameRevealed: p.nameRevealed,
            isAdmin: false,
          }
        );
        return caption !== "?";
      }),
    [data.profiles, isNameVisible, isProfileVisible, state.profileDisplayNames]
  );
  const selectedAccused = accuseCandidates.find((p) => p.id === selectedProfileId);

  const portraitHighlightId = useMemo(
    () =>
      resolvePortraitHighlightSpeakerId(
        currentScene.lines[state.lineIndex]
      ),
    [currentScene.lines, state.lineIndex]
  );

  const portraitLayout = useMemo(
    () =>
      buildPortraitLayout(currentScene, state.lineIndex, portraitHighlightId),
    [currentScene, state.lineIndex, portraitHighlightId]
  );

  const effectiveSceneBackground = useMemo(
    () =>
      resolveBackground(
        resolveEffectiveSceneBackground(currentScene, state.lineIndex)
      ),
    [currentScene, state.lineIndex]
  );

  const canAdvanceByClick = Boolean(
    currentLine && !hasChoices && !interaction
  );

  const advanceDialogueText = currentLine?.text ?? "";
  const advanceTw = useTypewriterLine(
    advanceDialogueText,
    canAdvanceByClick,
    state.settings.textSpeed
  );

  const mcqFeedbackTypingEnabled = Boolean(
    showingMcqWrongFeedback && mcqWrongFeedback
  );
  const mcqFeedbackText = mcqWrongFeedback?.text ?? "";
  const mcqFbTw = useTypewriterLine(
    mcqFeedbackText,
    mcqFeedbackTypingEnabled,
    state.settings.textSpeed
  );

  function updateSfxPrefs(next: SfxPrefs) {
    const saved = saveSfxPrefs(next);
    setSfxPrefs(saved);
  }

  return (
    <div className="vn-shell">
      <div className="vn-scene" style={{ background: effectiveSceneBackground }}>
        <div className="vn-scene-hud" aria-hidden={false}>
          <div className="vn-scene-title">
            Points: {state.points}
          </div>
          <div className="vn-scene-hud-btns">
            <button
              type="button"
              className="vn-icon-btn"
              onClick={() => {
                playSfx("panel", sfxPrefs);
                setShowHistory((v) => !v);
              }}
              title="Dialogue history"
              aria-label="Open dialogue history"
            >
              <IconHistory />
            </button>
            <button
              type="button"
              className={`vn-icon-btn${corkboardHasUnread ? " vn-icon-btn--has-badge" : ""}`}
              onClick={() => openCorkboard()}
              title={
                corkboardHasUnread ? "Corkboard (new intel)" : "Corkboard"
              }
              aria-label={
                corkboardHasUnread
                  ? "Open corkboard, new intel to review"
                  : "Open corkboard"
              }
            >
              <IconCorkboard />
              {corkboardHasUnread ? (
                <span className="vn-icon-badge-dot" aria-hidden />
              ) : null}
            </button>
            <button
              type="button"
              className="vn-icon-btn"
              onClick={() => {
                playSfx("panel", sfxPrefs);
                setShowSettings((v) => !v);
              }}
              title="Settings"
              aria-label="Open settings"
            >
              <IconGear />
            </button>
          </div>
        </div>

        <div className="vn-portrait-layer">
          <div className="vn-portrait-area">
            <div className="vn-portrait-row">
              <div className="vn-portrait-cluster vn-portrait-cluster--left">
                {portraitLayout.left.map((slot) => (
                  <PortraitFigure
                    key={slot.speakerId}
                    slot={slot}
                    charById={charById}
                    speakerLabelCtx={speakerLabelCtx}
                    campaignProfiles={data.profiles}
                    isImageVisible={isImageVisible}
                  />
                ))}
              </div>
              <div className="vn-portrait-cluster vn-portrait-cluster--center">
                {portraitLayout.center.map((slot) => (
                  <PortraitFigure
                    key={slot.speakerId}
                    slot={slot}
                    charById={charById}
                    speakerLabelCtx={speakerLabelCtx}
                    campaignProfiles={data.profiles}
                    isImageVisible={isImageVisible}
                  />
                ))}
              </div>
              <div className="vn-portrait-cluster vn-portrait-cluster--right">
                {portraitLayout.right.map((slot) => (
                  <PortraitFigure
                    key={slot.speakerId}
                    slot={slot}
                    charById={charById}
                    speakerLabelCtx={speakerLabelCtx}
                    campaignProfiles={data.profiles}
                    isImageVisible={isImageVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="vn-scene-fill" aria-hidden />

        <div className="vn-dialogue-outer">
          <button
            type="button"
            className={`vn-corkboard-toast-anchor${
              corkboardToast ? " vn-corkboard-toast-anchor--visible" : ""
            }`}
            aria-hidden={!corkboardToast}
            aria-label={
              corkboardToast
                ? "Corkboard updated — open corkboard"
                : undefined
            }
            tabIndex={corkboardToast ? 0 : -1}
            title={
              corkboardToast ? "Open corkboard (new intel)" : undefined
            }
            onClick={() => {
              if (!corkboardToast) return;
              playSfx("panel", sfxPrefs);
              openCorkboard();
            }}
          >
            <span className="vn-corkboard-toast">
              <span className="vn-corkboard-toast-text">Corkboard updated</span>
            </span>
          </button>
          {canAdvanceByClick ? (
            <button
              type="button"
              className="vn-dialogue-frame vn-dialogue-frame--advance"
              onClick={() => {
                if (!advanceTw.isRevealComplete) {
                  advanceTw.skipToEnd();
                  return;
                }
                playSfx("advance", sfxPrefs);
                dispatch({ type: "advanceDialogue" });
              }}
            >
              {speakerDisplayLabel != null ? (
                <div
                  className="vn-speaker"
                  style={{
                    color: speaker?.accent || "rgba(253, 230, 200, 0.95)",
                  }}
                >
                  {speakerDisplayLabel}
                </div>
              ) : null}
              <p
                className={`vn-line${
                  currentLine?.speakerId === "narrator" ? " vn-line--narrator" : ""
                }`}
              >
                {advanceTw.visibleText}
              </p>
              <span className="vn-continue-hint">
                {"Click to continue"}
              </span>
            </button>
          ) : (
            <div
              className="vn-dialogue-frame vn-dialogue-frame--static"
              style={{ color: "inherit" }}
            >
              {speakerDisplayLabel != null ? (
                <div
                  className="vn-speaker"
                  style={{
                    color: speaker?.accent || "rgba(253, 230, 200, 0.95)",
                  }}
                >
                  {speakerDisplayLabel}
                </div>
              ) : null}
              <p
                className={`vn-line${
                  currentLine?.speakerId === "narrator" ? " vn-line--narrator" : ""
                }`}
              >
                {currentLine?.text ?? "No dialogue loaded."}
              </p>

              {hasChoices ? (
                <div className="vn-choices">
                  {visibleChoices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      className="vn-pill"
                      onClick={() => {
                        playSfx("select", sfxPrefs);
                        dispatch({ type: "chooseOption", optionId: choice.id });
                      }}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              ) : interaction?.kind === "mcq" ? (
                showingMcqWrongFeedback && mcqWrongFeedback ? (
                  <button
                    type="button"
                    className="vn-dialogue-frame vn-dialogue-frame--advance"
                    onClick={() => {
                      if (!mcqFbTw.isRevealComplete) {
                        mcqFbTw.skipToEnd();
                        return;
                      }
                      playSfx("advance", sfxPrefs);
                      dispatch({ type: "advanceDialogue" });
                    }}
                  >
                    {mcqFbSpeakerLabel ? (
                      <div
                        className="vn-speaker"
                        style={{
                          color:
                            mcqFbSpeakerStyle?.accent ||
                            "rgba(253, 230, 200, 0.95)",
                        }}
                      >
                        {mcqFbSpeakerLabel}
                      </div>
                    ) : null}
                    <p
                      className={`vn-line${
                        mcqFbSpeakerId === "narrator" ? " vn-line--narrator" : ""
                      }`}
                    >
                      {mcqFbTw.visibleText}
                    </p>
                    <span className="vn-continue-hint">
                      {"Click to continue"}
                    </span>
                  </button>
                ) : (
                  <div className="vn-interaction-box">
                    <p className="vn-interaction-prompt">{interaction.prompt}</p>
                    <div className="vn-choices">
                      {interaction.options.map((option) => {
                        const eliminated = Boolean(
                          state.flags[
                            mcqEliminatedFlagKey(
                              currentScene.id,
                              state.lineIndex,
                              option.id
                            )
                          ]
                        );
                        const selected = selectedOptionIds.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            className={`vn-pill${selected ? " vn-pill--selected-mcq" : ""}`}
                            disabled={eliminated}
                            onClick={() => {
                              if (eliminated) return;
                              playSfx("select", sfxPrefs);
                              dispatch({
                                type: "selectInteractionOption",
                                optionId: option.id,
                              });
                            }}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="vn-pill vn-pill--primary"
                      disabled={!selectedOptionIds.length}
                      onClick={() => {
                        playSfx("submit", sfxPrefs);
                        dispatch({ type: "submitInteraction" });
                      }}
                    >
                      Submit answer
                    </button>
                  </div>
                )
              ) : interaction?.kind === "accuse" ? (
                <div className="vn-interaction-box">
                  <p className="vn-interaction-prompt vn-interaction-prompt-strong">
                    {interaction.prompt}
                  </p>
                  <div className="vn-accuse-grid">
                    {accuseCandidates.map((p) => {
                      const imageOpen = p.imageRevealed || isImageVisible(p.id);
                      const nameOpen = p.nameRevealed || isNameVisible(p.id);
                      const chipLabel = polaroidCaptionFromCampaign(
                        p.name,
                        state.profileDisplayNames,
                        p.id,
                        {
                          profileVisible:
                            p.profileRevealed || isProfileVisible(p.id),
                          nameVisible: nameOpen,
                          campaignNameRevealed: p.nameRevealed,
                          isAdmin: false,
                        }
                      );
                      const isSelected = selectedProfileId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`vn-accuse-chip${isSelected ? " selected" : ""}`}
                          onClick={() => {
                            playSfx("select", sfxPrefs);
                            dispatch({ type: "selectAccusedProfile", profileId: p.id });
                          }}
                        >
                          <img
                            src={
                              imageOpen
                                ? p.image
                                : "data:image/svg+xml," +
                                  encodeURIComponent(
                                    `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='150'><rect fill='%23292420' width='120' height='150'/><text x='60' y='84' font-size='48' text-anchor='middle' fill='%23575551'>?</text></svg>`
                                  )
                            }
                            alt=""
                          />
                          <span>{chipLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAccused ? (
                    <div className="vn-accuse-preview">
                      <p className="muted" style={{ margin: "0 0 0.45rem" }}>
                        Selected:
                      </p>
                      <img
                        src={
                          selectedAccused.imageRevealed ||
                          isImageVisible(selectedAccused.id)
                            ? selectedAccused.image
                            : "data:image/svg+xml," +
                              encodeURIComponent(
                                `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='150'><rect fill='%23292420' width='120' height='150'/><text x='60' y='84' font-size='48' text-anchor='middle' fill='%23575551'>?</text></svg>`
                              )
                        }
                        alt=""
                      />
                      <div>
                        {polaroidCaptionFromCampaign(
                          selectedAccused.name,
                          state.profileDisplayNames,
                          selectedAccused.id,
                          {
                            profileVisible:
                              selectedAccused.profileRevealed ||
                              isProfileVisible(selectedAccused.id),
                            nameVisible:
                              selectedAccused.nameRevealed ||
                              isNameVisible(selectedAccused.id),
                            campaignNameRevealed: selectedAccused.nameRevealed,
                            isAdmin: false,
                          }
                        )}
                      </div>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="vn-pill vn-pill--primary"
                    disabled={!selectedProfileId}
                    onClick={() => {
                      playSfx("submit", sfxPrefs);
                      dispatch({ type: "submitInteraction" });
                    }}
                  >
                    {interaction.submitLabel ?? "It's you!"}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {showHistory ? (
        <div
          className="vn-modal-overlay"
          onClick={() => setShowHistory(false)}
          role="presentation"
        >
          <div
            className="vn-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Dialogue history"
          >
            <div className="vn-panel-head">
              <h3>Dialogue history</h3>
              <button
                type="button"
                className="vn-icon-btn"
                onClick={() => {
                  playSfx("panel", sfxPrefs);
                  setShowHistory(false);
                }}
                title="Close"
                aria-label="Close history"
              >
                <IconClose />
              </button>
            </div>
            {state.history.length ? (
              <div className="vn-history-list" ref={historyListRef}>
                {state.history.map((h) => (
                  <p key={`${h.atMs}-${h.text}`}>
                    {h.speakerName ? (
                      <>
                        <strong>{h.speakerName}:</strong>{" "}
                      </>
                    ) : null}
                    {h.text}
                  </p>
                ))}
              </div>
            ) : (
              <p className="muted">No dialogue has been logged yet.</p>
            )}
          </div>
        </div>
      ) : null}

      {showSettings ? (
        <div
          className="vn-modal-overlay"
          onClick={() => setShowSettings(false)}
          role="presentation"
        >
          <div
            className="vn-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Settings"
          >
            <div className="vn-panel-head">
              <h3>Settings</h3>
              <button
                type="button"
                className="vn-icon-btn"
                onClick={() => {
                  playSfx("panel", sfxPrefs);
                  setShowSettings(false);
                }}
                title="Close"
                aria-label="Close settings"
              >
                <IconClose />
              </button>
            </div>
            <label className="vn-setting-row">
              <span>
                Text speed: {state.settings.textSpeed}
                {state.settings.textSpeed >= 100 ? " (instant)" : ""}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={state.settings.textSpeed}
                onChange={(e) =>
                  dispatch({ type: "setTextSpeed", value: Number(e.target.value) })
                }
              />
            </label>
            <label className="vn-setting-row">
              <input
                type="checkbox"
                checked={state.settings.autoAdvance}
                onChange={(e) =>
                  dispatch({ type: "setAutoAdvance", value: e.target.checked })
                }
              />
              <span>Auto-advance (placeholder)</span>
            </label>
            <label className="vn-setting-row">
              <input
                type="checkbox"
                checked={sfxPrefs.enabled}
                onChange={(e) =>
                  updateSfxPrefs({ ...sfxPrefs, enabled: e.target.checked })
                }
              />
              <span>Sound effects</span>
            </label>
            <label className="vn-setting-row">
              <span>SFX volume: {Math.round(sfxPrefs.volume * 100)}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(sfxPrefs.volume * 100)}
                onChange={(e) =>
                  updateSfxPrefs({
                    ...sfxPrefs,
                    volume: Number(e.target.value) / 100,
                  })
                }
                disabled={!sfxPrefs.enabled}
              />
            </label>
            <button
              type="button"
              className="vn-text-btn"
              title="Clears story progress, VN unlocks, and local corkboard seen-state so NEW badges can show again."
              onClick={() => {
                clearAck();
                reset();
              }}
            >
              Reset VN play state
            </button>
          </div>
        </div>
      ) : null}

      <CorkboardModal open={showCorkboard} onClose={closeCorkboard} />
      {profileModalId ? (
        <ProfileModal profileId={profileModalId} onClose={closeProfileUi} />
      ) : null}
    </div>
  );
}
