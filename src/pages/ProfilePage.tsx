import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";
import { EntryText } from "../components/EntryText";
import {
  isEntryNew,
  isImageNew,
  isNameNew,
  visibleTokensAfterVisit,
} from "../newBadges";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { data, ack, setProfile, mergeAck } = useCampaign();

  const profile = useMemo(
    () => data.profiles.find((p) => p.id === id),
    [data.profiles, id]
  );

  const knownIds = useMemo(
    () => new Set(data.profiles.map((p) => p.id)),
    [data.profiles]
  );

  const entriesToShow = useMemo(() => {
    if (isAdmin) return profile?.entries ?? [];
    return (profile?.entries ?? []).filter((e) => e.revealed);
  }, [profile?.entries, isAdmin]);

  const showEntriesSection = useMemo(() => {
    if (!profile) return false;
    if (isAdmin) return profile.entries.length > 0;
    return profile.entries.some((e) => e.revealed);
  }, [profile, isAdmin]);

  useEffect(() => {
    if (!profile || !id) return;
    return () => {
      mergeAck(id, visibleTokensAfterVisit(profile, isAdmin));
    };
  }, [id, profile, isAdmin, mergeAck]);

  if (!profile) {
    return (
      <div className="paper">
        <p>Profile not found.</p>
        <Link to="/">← Corkboard</Link>
      </div>
    );
  }

  if (!profile.profileRevealed && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const showName =
    isAdmin || (profile.profileRevealed && profile.nameRevealed);
  const showImage =
    isAdmin || (profile.profileRevealed && profile.imageRevealed);

  return (
    <div className="paper">
      <p>
        <Link to="/" className="muted">
          ← Corkboard
        </Link>
      </p>
      <div className="profile-header">
        <div>
          {showImage ? (
            <>
              <img src={profile.image} alt="" />
              {!isAdmin && isImageNew(profile, ack) ? (
                <p style={{ margin: "0.35rem 0 0" }}>
                  <span className="badge-new">NEW</span>
                </p>
              ) : null}
            </>
          ) : (
            <div
              style={{
                aspectRatio: "4/5",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #fff",
                boxShadow: "2px 3px 10px rgba(0,0,0,0.2)",
              }}
            >
              <span className="placeholder-q">?</span>
            </div>
          )}
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>
            {showName ? profile.name : "?"}
            {!isAdmin && showName && isNameNew(profile, ack) ? (
              <>
                {" "}
                <span className="badge-new">NEW</span>
              </>
            ) : null}
          </h1>
          {isAdmin ? (
            <div className="admin-strip">
              <strong>Admin</strong>
              <div className="admin-controls" style={{ marginTop: "0.5rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.profileRevealed}
                    onChange={() =>
                      setProfile(profile.id, (p) => ({
                        ...p,
                        profileRevealed: !p.profileRevealed,
                      }))
                    }
                  />{" "}
                  Reveal profile publicly
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.nameRevealed}
                    onChange={() =>
                      setProfile(profile.id, (p) => ({
                        ...p,
                        nameRevealed: !p.nameRevealed,
                      }))
                    }
                  />{" "}
                  Reveal name
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={profile.imageRevealed}
                    onChange={() =>
                      setProfile(profile.id, (p) => ({
                        ...p,
                        imageRevealed: !p.imageRevealed,
                      }))
                    }
                  />{" "}
                  Reveal photo
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showEntriesSection ? (
        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Entries</h2>
          {entriesToShow.map((e) => {
            const showNew =
              !isAdmin &&
              profile.profileRevealed &&
              isEntryNew(profile.id, e.id, e.revealed, ack);

            return (
              <article key={e.id} className="entry-block">
                <div className="entry-head">
                  <span className="muted">Note #{e.id}</span>
                  <span>
                    {showNew ? <span className="badge-new">NEW</span> : null}
                    {isAdmin ? (
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() =>
                          setProfile(profile.id, (p) => ({
                            ...p,
                            entries: p.entries.map((x) =>
                              x.id === e.id ? { ...x, revealed: !x.revealed } : x
                            ),
                          }))
                        }
                      >
                        {e.revealed ? "Un-reveal" : "Reveal publicly"}
                      </button>
                    ) : null}
                  </span>
                </div>
                <EntryText text={e.text} knownProfileIds={knownIds} />
              </article>
            );
          })}
        </section>
      ) : null}

      {isAdmin ? (
        <p className="muted" style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>
          Link to another dossier in text with{" "}
          <code>
            [[{`profile-id`}]]
          </code>{" "}
          (example: <code>[[sarah-chen]]</code>).
        </p>
      ) : null}
    </div>
  );
}
