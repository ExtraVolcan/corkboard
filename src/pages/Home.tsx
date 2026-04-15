import { useRef, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";
import { profileHasAnyNew } from "../newBadges";

export function Home() {
  const { isAdmin } = useAuth();
  const { data, ack, refresh, resetToSeed, saveFullCampaign } = useCampaign();
  const importRef = useRef<HTMLInputElement>(null);

  const visible = data.profiles.filter((p) => p.profileRevealed || isAdmin);

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mystery-campaign.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function onImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      void (async () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (!parsed?.profiles || !Array.isArray(parsed.profiles)) {
            alert("Invalid file: expected { profiles: [...] }");
            return;
          }
          await saveFullCampaign(parsed);
        } catch {
          alert("Could not import (check JSON and admin session).");
        }
        await refresh();
      })();
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="paper">
      <h1>Profiles</h1>
      <p className="muted">
        {isAdmin
          ? "You see every dossier. Reveal a profile or entries from each profile page."
          : "Known persons of interest. New intel is marked when first shown."}
      </p>
      {isAdmin ? (
        <div
          className="admin-strip"
          style={{ marginBottom: "1rem", background: "#e0f2fe", borderColor: "#7dd3fc" }}
        >
          <strong>Campaign data</strong> — lives on the server. Everyone sees the same
          reveals. This device only stores which items you have already dismissed as
          “NEW” (in <code>localStorage</code>).
          <div className="admin-controls" style={{ marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-small" onClick={exportJson}>
              Export JSON backup
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => importRef.current?.click()}
            >
              Import JSON…
            </button>
            <button
              type="button"
              className="btn btn-small"
              onClick={() => {
                if (
                  confirm(
                    "Reset campaign on the server to the bundled sample from src/data/seed.json?"
                  )
                ) {
                  void (async () => {
                    try {
                      await resetToSeed();
                    } catch {
                      alert("Reset failed. Sign in as admin and try again.");
                    }
                  })();
                }
              }}
            >
              Reset server to sample
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={onImportFile}
            />
          </div>
        </div>
      ) : null}
      <div className="profile-grid">
        {visible.map((p) => {
          const showNew = profileHasAnyNew(p, ack, isAdmin);
          return (
            <Link key={p.id} to={`/profile/${p.id}`} className="paper profile-card">
              {p.profileRevealed && p.imageRevealed ? (
                <img className="thumb" src={p.image} alt="" />
              ) : isAdmin && p.imageRevealed ? (
                <img className="thumb" src={p.image} alt="" />
              ) : isAdmin && !p.imageRevealed ? (
                <div
                  className="thumb"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ddd",
                  }}
                >
                  <span className="placeholder-q">?</span>
                </div>
              ) : (
                <div
                  className="thumb"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ddd",
                  }}
                >
                  <span className="placeholder-q">?</span>
                </div>
              )}
              <div className="meta">
                <span>
                  {p.profileRevealed && p.nameRevealed
                    ? p.name
                    : isAdmin && p.nameRevealed
                      ? p.name
                      : "?"}
                </span>
                {showNew ? <span className="badge-new">NEW</span> : null}
              </div>
              {!p.profileRevealed && isAdmin ? (
                <p className="muted" style={{ margin: "0.5rem 0 0", fontSize: "0.8rem" }}>
                  Hidden from public
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="muted">Nothing published yet. Check back later.</p>
      ) : null}
    </div>
  );
}
