import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVn } from "../vn/state";

export function VisualNovelPage() {
  const { state, currentScene, currentLine, dispatch, reset, getSpeaker } = useVn();
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const speaker = getSpeaker(currentLine?.speakerId);
  const hasChoices = Boolean(currentLine?.choices?.length);

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
            {currentLine?.choices?.map((choice) => (
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
