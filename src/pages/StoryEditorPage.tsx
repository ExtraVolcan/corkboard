import { useCallback, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import {
  clearStoryOverride,
  getDefaultStoryBundle,
  loadStoryBundle,
  type StoryBundle,
  saveStoryBundle,
} from "../vn/storySource";
import { validateScenes, type SceneValidationError } from "../vn/validateScenes";

function errorsText(errors: SceneValidationError[]): string {
  return errors.map((e) => `${e.path}: ${e.message}`).join("\n");
}

export function StoryEditorPage() {
  const { isAdmin } = useAuth();
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(loadStoryBundle(), null, 2)
  );
  const [lastErrors, setLastErrors] = useState<SceneValidationError[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const parsed = useMemo((): StoryBundle | null => {
    try {
      const p = JSON.parse(jsonText) as StoryBundle;
      if (p?.version === 1 && Array.isArray(p.scenes)) {
        return {
          version: 1,
          characters: p.characters ?? getDefaultStoryBundle().characters,
          scenes: p.scenes,
        };
      }
    } catch {
      return null;
    }
    return null;
  }, [jsonText]);

  const runValidate = useCallback(() => {
    if (!parsed) {
      setLastErrors([{ path: "json", message: "Invalid or incomplete JSON" }]);
      return false;
    }
    const ch = (parsed.characters ?? []).map((c) => c.id);
    const err = validateScenes(parsed.scenes, ch);
    setLastErrors(err);
    return err.length === 0;
  }, [parsed]);

  const onSave = useCallback(() => {
    if (!parsed) {
      setMessage("Fix JSON first.");
      return;
    }
    const ch = (parsed.characters ?? []).map((c) => c.id);
    const err = validateScenes(parsed.scenes, ch);
    setLastErrors(err);
    if (err.length) {
      setMessage("Validation failed — check the list below.");
      return;
    }
    saveStoryBundle(parsed);
    setMessage("Saved. VN will reload the story (play state reset to start).");
  }, [parsed]);

  const onClear = useCallback(() => {
    if (!confirm("Remove the local override and use the built-in story from the app bundle?")) {
      return;
    }
    clearStoryOverride();
    setJsonText(JSON.stringify(loadStoryBundle(), null, 2));
    setLastErrors([]);
    setMessage("Cleared. Using bundled default story.");
  }, []);

  const onLoadDefault = useCallback(() => {
    const d = getDefaultStoryBundle();
    setJsonText(JSON.stringify(d, null, 2));
    setMessage("Replaced editor text with the default bundled story (not saved yet).");
  }, []);

  const onExport = useCallback(() => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mystery-vn-story.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [jsonText]);

  const onImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        if (typeof r.result === "string") {
          setJsonText(r.result);
          setMessage("File loaded into the editor. Validate, then save.");
        }
      };
      r.readAsText(f);
    },
    []
  );

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="paper admin-campaign-page" style={{ maxWidth: "56rem" }}>
      <h1>Story editor</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Edit the visual novel as JSON. The active story is the bundled default from{" "}
        <code>vn/scenes.ts</code> unless you save an override in this browser
        (stored in <code>localStorage</code>). Saving runs validation, persists the
        bundle, and resets in-progress play to the start.
      </p>
      <div
        className="admin-campaign-toolbar"
        style={{ flexWrap: "wrap", gap: "0.5rem" }}
      >
        <button type="button" className="btn" onClick={runValidate}>
          Validate
        </button>
        <button
          type="button"
          className="btn"
          onClick={onSave}
          disabled={!parsed}
        >
          Save override
        </button>
        <button type="button" className="btn btn-small" onClick={onClear}>
          Clear override
        </button>
        <button type="button" className="btn btn-small" onClick={onLoadDefault}>
          Load default from bundle
        </button>
        <button type="button" className="btn btn-small" onClick={onExport}>
          Export JSON
        </button>
        <label className="btn btn-small" style={{ cursor: "pointer" }}>
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={onImportFile}
          />
        </label>
        <Link to="/" className="btn btn-small" style={{ display: "inline-block" }}>
          Back to VN
        </Link>
      </div>
      {message ? (
        <p style={{ color: "var(--accent, #a7f3d0)" }} role="status">
          {message}
        </p>
      ) : null}
      {lastErrors.length > 0 ? (
        <pre
          className="paper"
          style={{
            maxHeight: "12rem",
            overflow: "auto",
            fontSize: "0.8rem",
            color: "#fecaca",
            background: "#1c1917",
            padding: "0.75rem",
            borderRadius: 6,
          }}
        >
          {errorsText(lastErrors)}
        </pre>
      ) : null}
      <label className="admin-label-block" style={{ display: "block" }}>
        Story bundle (JSON)
        <textarea
          className="admin-label-block"
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setMessage(null);
          }}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: "28rem",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.8rem",
            marginTop: "0.5rem",
          }}
        />
      </label>
      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Quick field reference</h2>
        <ul className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
          <li>
            <strong>Scene</strong>: <code>id</code>, <code>title</code>, <code>background</code>{" "}
            (URL or path), <code>lines</code>.
          </li>
          <li>
            <strong>Line</strong>: <code>text</code>; optional <code>speakerId</code> (must
            match a <code>characters</code> entry); <code>requireFlags</code> /{" "}
            <code>setFlags</code> for gating; <code>unlocks</code> for profile reveals;
            <code>choices</code> (branch) or <code>interaction</code> (MCQ / accuse).
          </li>
          <li>
            <strong>MCQ</strong>: <code>kind: &quot;mcq&quot;</code>, <code>prompt</code>,{" "}
            <code>redoable</code>, <code>options</code> with <code>id</code>, <code>label</code>,{" "}
            optional <code>correct</code> and <code>outcome</code>; optional{" "}
            <code>onCorrect</code> / <code>onIncorrect</code> with <code>nextSceneId</code>.
          </li>
          <li>
            <strong>Accusation</strong>: <code>kind: &quot;accuse&quot;</code>,{" "}
            <code>correctProfileId</code>, <code>prompt</code>, same outcomes.
          </li>
        </ul>
      </section>
    </div>
  );
}
