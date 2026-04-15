import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";
import { getToken, uploadProfileImage } from "../api/campaignApi";
import type { CampaignData, Entry, Profile } from "../types";

const PROFILE_ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150" viewBox="0 0 120 150"><rect fill="%23ddd" width="120" height="150"/><text x="60" y="85" font-size="48" text-anchor="middle" fill="%23999">?</text></svg>`
  );

function newEntryId(): string {
  return `e-${crypto.randomUUID().slice(0, 10)}`;
}

export function AdminCampaign() {
  const { isAdmin } = useAuth();
  const { data, ready, saveFullCampaign, refresh } = useCampaign();
  const [draft, setDraft] = useState<CampaignData>({ profiles: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  /** Load draft once when entering the editor; do not resync on poll (would wipe edits). */
  const draftLoaded = useRef(false);

  useEffect(() => {
    return () => {
      draftLoaded.current = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || draftLoaded.current) return;
    setDraft(structuredClone(data) as CampaignData);
    draftLoaded.current = true;
  }, [ready, data]);

  const discard = useCallback(() => {
    setDraft(structuredClone(data) as CampaignData);
    setError(null);
  }, [data]);

  const save = useCallback(async () => {
    const ids = new Set<string>();
    for (const p of draft.profiles) {
      if (!PROFILE_ID_RE.test(p.id)) {
        setError(
          `Invalid profile id "${p.id}". Use lowercase letters, numbers, and hyphens (e.g. sarah-chen).`
        );
        return;
      }
      if (ids.has(p.id)) {
        setError(`Duplicate profile id: ${p.id}`);
        return;
      }
      ids.add(p.id);
      const eids = new Set<string>();
      for (const e of p.entries) {
        if (!e.id?.trim()) {
          setError(`Empty entry id under profile ${p.id}`);
          return;
        }
        if (eids.has(e.id)) {
          setError(`Duplicate entry id "${e.id}" under ${p.id}`);
          return;
        }
        eids.add(e.id);
      }
    }
    setError(null);
    setSaving(true);
    try {
      await saveFullCampaign(draft);
      await refresh(true);
    } catch {
      setError("Save failed. Try signing in again.");
    } finally {
      setSaving(false);
    }
  }, [draft, saveFullCampaign, refresh]);

  if (!isAdmin) return <Navigate to="/login" replace />;

  function setProfileAt(index: number, next: Profile) {
    setDraft((d) => ({
      ...d,
      profiles: d.profiles.map((p, i) => (i === index ? next : p)),
    }));
  }

  function removeProfile(index: number) {
    if (!confirm("Delete this profile and all its entries from the campaign?")) return;
    setDraft((d) => ({
      ...d,
      profiles: d.profiles.filter((_, i) => i !== index),
    }));
  }

  function moveProfile(index: number, delta: number) {
    setDraft((d) => {
      const next = [...d.profiles];
      const j = index + delta;
      if (j < 0 || j >= next.length) return d;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...d, profiles: next };
    });
  }

  function addProfile() {
    const id = newId.trim().toLowerCase();
    if (!PROFILE_ID_RE.test(id)) {
      setError(
        "New profile id must be lowercase, use hyphens (e.g. the-archivist)."
      );
      return;
    }
    if (draft.profiles.some((p) => p.id === id)) {
      setError(`Profile id already exists: ${id}`);
      return;
    }
    const name = newName.trim() || "New profile";
    setDraft((d) => ({
      ...d,
      profiles: [
        ...d.profiles,
        {
          id,
          name,
          image: PLACEHOLDER_IMAGE,
          nameRevealed: false,
          imageRevealed: false,
          profileRevealed: false,
          entries: [],
        },
      ],
    }));
    setNewId("");
    setNewName("");
    setError(null);
  }

  async function onUploadImage(profileIndex: number, file: File | null) {
    if (!file) return;
    const t = getToken();
    if (!t) return;
    try {
      const url = await uploadProfileImage(t, file);
      const p = draft.profiles[profileIndex];
      if (!p) return;
      setProfileAt(profileIndex, { ...p, image: url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <div className="paper admin-campaign-page">
      <p>
        <Link to="/" className="muted">
          ← Corkboard
        </Link>
      </p>
      <h1>Edit campaign</h1>
      <p className="muted">
        Add or change dossiers and notes. Save to update the database. Uploaded images
        are stored on the server under <code>/uploads/</code> (they can be lost on some
        hosts without persistent disk—keep backups or use image URLs instead).
      </p>

      {error ? <p className="error">{error}</p> : null}

      <div className="admin-campaign-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" className="btn" disabled={saving} onClick={discard}>
          Discard unsaved
        </button>
      </div>

      <section className="admin-add-profile">
        <h2>Add profile</h2>
        <div className="admin-form-row">
          <label>
            Id (URL slug)
            <input
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="e.g. marcus-veil"
              autoComplete="off"
            />
          </label>
          <label>
            Display name
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name on dossier"
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={addProfile}>
            Add profile
          </button>
        </div>
      </section>

      {draft.profiles.map((p, pi) => (
        <details
          key={p.id}
          className="admin-profile-block paper"
          open={pi === 0}
          style={{ marginTop: "1rem" }}
        >
          <summary>
            <strong>{p.name || p.id}</strong>{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              ({p.id})
            </span>
          </summary>
          <div className="admin-profile-body">
            <div className="admin-form-row">
              <label>
                Profile id
                <input value={p.id} disabled title="Id cannot be changed after creation" />
              </label>
              <label>
                Display name
                <input
                  value={p.name}
                  onChange={(e) =>
                    setProfileAt(pi, { ...p, name: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="admin-label-block">
              Image URL (or upload below)
              <input
                value={p.image}
                onChange={(e) =>
                  setProfileAt(pi, { ...p, image: e.target.value })
                }
                placeholder="https://… or /uploads/…"
              />
            </label>
            <div className="admin-upload-row">
              <img
                className="admin-thumb"
                src={p.image || PLACEHOLDER_IMAGE}
                alt=""
              />
              <label className="btn btn-small">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    void onUploadImage(pi, e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
            <div className="admin-check-row">
              <label>
                <input
                  type="checkbox"
                  checked={p.profileRevealed}
                  onChange={() =>
                    setProfileAt(pi, {
                      ...p,
                      profileRevealed: !p.profileRevealed,
                    })
                  }
                />{" "}
                Profile visible to public
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={p.nameRevealed}
                  onChange={() =>
                    setProfileAt(pi, { ...p, nameRevealed: !p.nameRevealed })
                  }
                />{" "}
                Name revealed
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={p.imageRevealed}
                  onChange={() =>
                    setProfileAt(pi, { ...p, imageRevealed: !p.imageRevealed })
                  }
                />{" "}
                Photo revealed
              </label>
            </div>

            <h3>Entries</h3>
            {p.entries.map((e, ei) => (
              <div key={e.id} className="admin-entry-card">
                <div className="admin-form-row">
                  <label>
                    Entry id
                    <input
                      value={e.id}
                      onChange={(ev) => {
                        const entries = p.entries.map((x, j) =>
                          j === ei ? { ...x, id: ev.target.value } : x
                        );
                        setProfileAt(pi, { ...p, entries });
                      }}
                    />
                  </label>
                  <label className="admin-checkbox-inline">
                    <input
                      type="checkbox"
                      checked={e.revealed}
                      onChange={() => {
                        const entries = p.entries.map((x, j) =>
                          j === ei ? { ...x, revealed: !x.revealed } : x
                        );
                        setProfileAt(pi, { ...p, entries });
                      }}
                    />{" "}
                    Revealed to public
                  </label>
                </div>
                <label className="admin-label-block">
                  Text (use [[profile-id]] for links)
                  <textarea
                    rows={5}
                    value={e.text}
                    onChange={(ev) => {
                      const entries = p.entries.map((x, j) =>
                        j === ei ? { ...x, text: ev.target.value } : x
                      );
                      setProfileAt(pi, { ...p, entries });
                    }}
                  />
                </label>
                <div className="admin-entry-actions">
                  <button
                    type="button"
                    className="btn btn-small"
                    disabled={ei === 0}
                    onClick={() => {
                      const entries = [...p.entries];
                      [entries[ei - 1], entries[ei]] = [
                        entries[ei],
                        entries[ei - 1],
                      ];
                      setProfileAt(pi, { ...p, entries });
                    }}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="btn btn-small"
                    disabled={ei >= p.entries.length - 1}
                    onClick={() => {
                      const entries = [...p.entries];
                      [entries[ei], entries[ei + 1]] = [
                        entries[ei + 1],
                        entries[ei],
                      ];
                      setProfileAt(pi, { ...p, entries });
                    }}
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => {
                      if (!confirm("Remove this entry?")) return;
                      setProfileAt(pi, {
                        ...p,
                        entries: p.entries.filter((_, j) => j !== ei),
                      });
                    }}
                  >
                    Remove entry
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-small"
              onClick={() => {
                const entry: Entry = {
                  id: newEntryId(),
                  text: "",
                  revealed: false,
                };
                setProfileAt(pi, { ...p, entries: [...p.entries, entry] });
              }}
            >
              Add entry
            </button>

            <div className="admin-profile-footer">
              <button
                type="button"
                className="btn btn-small"
                disabled={pi === 0}
                onClick={() => moveProfile(pi, -1)}
              >
                Move profile up
              </button>
              <button
                type="button"
                className="btn btn-small"
                disabled={pi >= draft.profiles.length - 1}
                onClick={() => moveProfile(pi, 1)}
              >
                Move profile down
              </button>
              <button
                type="button"
                className="btn btn-small"
                style={{ color: "#991b1b" }}
                onClick={() => removeProfile(pi)}
              >
                Delete profile
              </button>
            </div>
          </div>
        </details>
      ))}

      <p style={{ marginTop: "1.5rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </p>
    </div>
  );
}
