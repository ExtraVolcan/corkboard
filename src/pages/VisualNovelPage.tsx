import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { loadSfxPrefs, playSfx, saveSfxPrefs, type SfxPrefs } from "../audio/sfx";
import { useCampaign } from "../campaign";
import { resolveBackground, resolvePortrait } from "../vn/assets";
import {
  resolveSpeakerDisplayLabel,
  resolveSpeakerPlaceholderInitial,
} from "../vn/speakerLabel";
import { useVn } from "../vn/state";

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
  const { data } = useCampaign();
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
  } = useVn();
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sfxPrefs, setSfxPrefs] = useState<SfxPrefs>(() => loadSfxPrefs());

  useEffect(() => {
    if (!showHistory && !showSettings) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowHistory(false);
        setShowSettings(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showHistory, showSettings]);

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

  const accuseCandidates = useMemo(
    () =>
      data.profiles.filter((p) => {
        const profileOpen = p.profileRevealed || isProfileVisible(p.id);
        const nameOpen = p.nameRevealed || isNameVisible(p.id);
        return profileOpen && nameOpen;
      }),
    [data.profiles, isNameVisible, isProfileVisible]
  );
  const selectedAccused = accuseCandidates.find((p) => p.id === selectedProfileId);

  const sceneProgress = useMemo(() => {
    if (!currentScene.lines.length) return 0;
    return Math.min(
      100,
      Math.round(((state.lineIndex + 1) / currentScene.lines.length) * 100)
    );
  }, [currentScene.lines.length, state.lineIndex]);

  const speakerId = currentLine?.speakerId;
  const profileMatch = useMemo(
    () => (speakerId ? data.profiles.find((p) => p.id === speakerId) : undefined),
    [data.profiles, speakerId]
  );
  const portraitImage =
    resolvePortrait(currentLine?.portraitId) ??
    (profileMatch && (isImageVisible(profileMatch.id) || profileMatch.imageRevealed)
      ? profileMatch.image
      : null);
  const placeholderLetter = useMemo(
    () =>
      resolveSpeakerPlaceholderInitial(
        currentLine?.speakerId,
        charById,
        speakerLabelCtx
      ),
    [currentLine?.speakerId, charById, speakerLabelCtx]
  );
  const accent = speaker?.accent || "#a8a29e";

  const canAdvanceByClick = Boolean(
    currentLine && !hasChoices && !interaction
  );

  function updateSfxPrefs(next: SfxPrefs) {
    const saved = saveSfxPrefs(next);
    setSfxPrefs(saved);
  }

  return (
    <div className="vn-shell">
      <div
        className="vn-scene"
        style={{ background: resolveBackground(currentScene.background) }}
      >
        <div className="vn-scene-hud" aria-hidden={false}>
          <div className="vn-scene-title">
            {currentScene.title}
            <span className="vn-scene-progress">Scene {sceneProgress}%</span>
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
            <Link
              className="vn-icon-btn"
              to="/corkboard"
              title="Corkboard"
              aria-label="Open corkboard"
            >
              <IconCorkboard />
            </Link>
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

        <div className="vn-scene-body">
          <div className="vn-portrait-area">
            {portraitImage ? (
              <img
                className="vn-portrait"
                src={portraitImage}
                alt={
                  speakerDisplayLabel ? `${speakerDisplayLabel} portrait` : ""
                }
              />
            ) : (
              <img
                className="vn-portrait"
                src={placeholderArt(placeholderLetter, accent)}
                alt=""
              />
            )}
          </div>
        </div>

        <div className="vn-dialogue-outer">
          {canAdvanceByClick ? (
            <button
              type="button"
              className="vn-dialogue-frame vn-dialogue-frame--advance"
              onClick={() => {
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
              <p className="vn-line">{currentLine?.text ?? "No dialogue loaded."}</p>
              <span className="vn-continue-hint">Click to continue</span>
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
              <p className="vn-line">{currentLine?.text ?? "No dialogue loaded."}</p>

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
                <div className="vn-interaction-box">
                  <p className="vn-interaction-prompt">{interaction.prompt}</p>
                  <div className="vn-choices">
                    {interaction.options.map((option) => {
                      const selected = selectedOptionIds.includes(option.id);
                      const disabled = interaction.redoable ? selected : false;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className="vn-pill"
                          disabled={disabled}
                          style={selected ? { opacity: 0.45 } : undefined}
                          onClick={() => {
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
              ) : interaction?.kind === "accuse" ? (
                <div className="vn-interaction-box">
                  <p className="vn-interaction-prompt vn-interaction-prompt-strong">
                    {interaction.prompt}
                  </p>
                  <div className="vn-accuse-grid">
                    {accuseCandidates.map((p) => {
                      const imageOpen = p.imageRevealed || isImageVisible(p.id);
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
                          <span>{p.name}</span>
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
                      <div>{selectedAccused.name}</div>
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
              <div className="vn-history-list">
                {state.history
                  .slice()
                  .reverse()
                  .map((h) => (
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
              <span>Text speed: {state.settings.textSpeed}</span>
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
            <button type="button" className="vn-text-btn" onClick={reset}>
              Reset VN play state
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
