import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCampaign } from "../campaign";
import { useVn } from "../vn/state";

export function VisualNovelPage() {
  const { data } = useCampaign();
  const {
    state,
    currentScene,
    currentLine,
    dispatch,
    reset,
    getSpeaker,
    isProfileVisible,
    isNameVisible,
    isImageVisible,
  } = useVn();
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const speaker = getSpeaker(currentLine?.speakerId);
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

  return (
    <div className="vn-shell paper">
      <div className="vn-stage" style={{ background: currentScene.background }}>
        <div className="vn-char-card">
          <div className="vn-char-label">Character Visual Slot</div>
          <p className="muted" style={{ marginTop: "0.45rem", marginBottom: 0 }}>
            Replace with sprite layers/Live2D/art later.
          </p>
        </div>
      </div>

      <div className="vn-hud">
        <div className="vn-hud-left">
          <strong>{currentScene.title}</strong>
          <span className="muted">Scene progress {sceneProgress}%</span>
          <span className="muted">Flags: {Object.keys(state.flags).length}</span>
        </div>
        <div className="vn-hud-right">
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setShowHistory((v) => !v)}
          >
            History
          </button>
          <Link className="btn btn-small" to="/corkboard">
            Open Corkboard
          </Link>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => setShowSettings((v) => !v)}
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      {showHistory ? (
        <section className="vn-panel">
          <div className="vn-panel-head">
            <h3>Dialogue history</h3>
            <button type="button" className="btn btn-small" onClick={() => setShowHistory(false)}>
              Close
            </button>
          </div>
          {state.history.length ? (
            <div className="vn-history-list">
              {state.history
                .slice()
                .reverse()
                .map((h) => (
                  <p key={`${h.atMs}-${h.text}`}>
                    <strong>{h.speakerName}:</strong> {h.text}
                  </p>
                ))}
            </div>
          ) : (
            <p className="muted">No dialogue has been logged yet.</p>
          )}
        </section>
      ) : null}

      {showSettings ? (
        <section className="vn-panel">
          <div className="vn-panel-head">
            <h3>Settings</h3>
            <button type="button" className="btn btn-small" onClick={() => setShowSettings(false)}>
              Close
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
          <button type="button" className="btn btn-small" onClick={reset}>
            Reset VN demo state
          </button>
        </section>
      ) : null}

      <section className="vn-dialogue-box">
        <div className="vn-speaker" style={{ color: speaker?.accent || undefined }}>
          {speaker?.name ?? "Narrator"}
        </div>
        <p className="vn-line">{currentLine?.text ?? "No dialogue loaded."}</p>

        {hasChoices ? (
          <div className="vn-choices">
            {visibleChoices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className="btn"
                onClick={() => dispatch({ type: "chooseOption", optionId: choice.id })}
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
                const tried = selectedOptionIds.includes(option.id);
                const disabled =
                  interaction.redoable ? tried : selectedOptionIds.length > 0;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className="btn"
                    disabled={disabled}
                    style={tried ? { opacity: 0.5 } : undefined}
                    onClick={() =>
                      dispatch({ type: "selectInteractionOption", optionId: option.id })
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedOptionIds.length}
              onClick={() => dispatch({ type: "submitInteraction" })}
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
                    onClick={() =>
                      dispatch({ type: "selectAccusedProfile", profileId: p.id })
                    }
                  >
                    <img
                      src={
                        imageOpen
                          ? p.image
                          : "data:image/svg+xml," +
                            encodeURIComponent(
                              `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='150'><rect fill='%23ddd' width='120' height='150'/><text x='60' y='84' font-size='48' text-anchor='middle' fill='%23999'>?</text></svg>`
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
                    selectedAccused.imageRevealed || isImageVisible(selectedAccused.id)
                      ? selectedAccused.image
                      : "data:image/svg+xml," +
                        encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='150'><rect fill='%23ddd' width='120' height='150'/><text x='60' y='84' font-size='48' text-anchor='middle' fill='%23999'>?</text></svg>`
                        )
                  }
                  alt=""
                />
                <div>{selectedAccused.name}</div>
              </div>
            ) : null}
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedProfileId}
              onClick={() => dispatch({ type: "submitInteraction" })}
            >
              {interaction.submitLabel ?? "It's you!"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch({ type: "advanceDialogue" })}
          >
            Continue
          </button>
        )}
      </section>
    </div>
  );
}
