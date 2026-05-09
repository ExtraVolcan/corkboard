import { useCallback, useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";
import { EntryText } from "../components/EntryText";
import {
  isEntryNew,
  isImageNew,
  isNameNew,
  visibleTokensAfterVisit,
} from "../newBadges";
import {
  findProfileWithSeedFallback,
  mergeProfilesWithSeed,
} from "../campaignSeedFallback";
import { polaroidCaptionFromCampaign } from "../vn/boardProfileLabel";
import { useVn } from "../vn/state";

export function ProfilePanel({
  profileId,
  variant,
  onCloseModal,
}: {
  profileId: string;
  variant: "page" | "modal";
  onCloseModal?: () => void;
}) {
  const { isAdmin } = useAuth();
  const { data, ack, setProfile, mergeAck } = useCampaign();
  const {
    state: vnState,
    isProfileVisible,
    isNameVisible,
    isImageVisible,
    isEntryVisible,
  } = useVn();

  const vnRevealGate = useMemo(
    () => ({
      isProfileVisible,
      isNameVisible,
      isImageVisible,
      isEntryVisible,
    }),
    [isProfileVisible, isNameVisible, isImageVisible, isEntryVisible]
  );

  const profile = useMemo(
    () => findProfileWithSeedFallback(data.profiles, profileId),
    [data.profiles, profileId]
  );

  const knownIds = useMemo(
    () => new Set(mergeProfilesWithSeed(data.profiles).map((p) => p.id)),
    [data.profiles]
  );

  const entriesToShow = useMemo(() => {
    if (isAdmin) return profile?.entries ?? [];
    return (profile?.entries ?? []).filter(
      (e) => e.revealed || isEntryVisible(profile?.id ?? "", e.id)
    );
  }, [profile?.entries, profile?.id, isAdmin, isEntryVisible]);

  const showEntriesSection = useMemo(() => {
    if (!profile) return false;
    if (isAdmin) return profile.entries.length > 0;
    return profile.entries.some(
      (e) => e.revealed || isEntryVisible(profile.id, e.id)
    );
  }, [profile, isAdmin, isEntryVisible]);

  const entryLinkLabel = useCallback(
    (pid: string) => {
      const t = findProfileWithSeedFallback(data.profiles, pid);
      if (!t) return pid;
      const profileVis = t.profileRevealed || isProfileVisible(t.id);
      const nameVis = t.nameRevealed || isNameVisible(t.id);
      const override = vnState.profileDisplayNames[pid];
      if (isAdmin) {
        return (
          (override !== undefined && override !== ""
            ? override
            : t.name?.trim()) || pid
        );
      }
      if (!profileVis) return "?";
      if (override !== undefined && override !== "") return override.trim();
      if (nameVis) return t.name.trim();
      return "?";
    },
    [
      data.profiles,
      isAdmin,
      isProfileVisible,
      isNameVisible,
      vnState.profileDisplayNames,
    ]
  );

  const profileHref = useCallback((pid: string) => {
    const qs = new URLSearchParams();
    qs.set("board", "1");
    qs.set("profile", pid);
    return `/?${qs.toString()}`;
  }, []);

  useEffect(() => {
    if (!profile || !profileId) return;
    return () => {
      const tokens = new Set(visibleTokensAfterVisit(profile, isAdmin));
      if (!isAdmin) {
        if (isNameVisible(profile.id)) tokens.add("__name__");
        if (isImageVisible(profile.id)) tokens.add("__image__");
        for (const e of profile.entries) {
          if (isEntryVisible(profile.id, e.id)) tokens.add(e.id);
        }
      }
      mergeAck(profileId, [...tokens]);
    };
  }, [
    profileId,
    profile,
    isAdmin,
    mergeAck,
    isNameVisible,
    isImageVisible,
    isEntryVisible,
  ]);

  if (!profile) {
    return (
      <div className="paper">
        <p>Profile not found.</p>
        {variant === "modal" ? (
          <button type="button" className="btn btn-small" onClick={onCloseModal}>
            Close
          </button>
        ) : (
          <Link to="/?board=1">← Corkboard</Link>
        )}
      </div>
    );
  }

  const effectiveProfileRevealed =
    profile.profileRevealed || isProfileVisible(profile.id);
  const effectiveNameRevealed =
    profile.nameRevealed || isNameVisible(profile.id);
  const effectiveImageRevealed =
    profile.imageRevealed || isImageVisible(profile.id);

  if (!effectiveProfileRevealed && !isAdmin) {
    if (variant === "modal") {
      return (
        <div className="paper">
          <p className="muted">This dossier isn&apos;t available yet.</p>
          <button type="button" className="btn btn-small" onClick={onCloseModal}>
            Close
          </button>
        </div>
      );
    }
    return <Navigate to="/?board=1" replace />;
  }

  const showName =
    isAdmin || (effectiveProfileRevealed && effectiveNameRevealed);
  const showImage =
    isAdmin || (effectiveProfileRevealed && effectiveImageRevealed);
  const dossierTitle = polaroidCaptionFromCampaign(
    profile.name,
    vnState.profileDisplayNames,
    profile.id,
    {
      profileVisible: effectiveProfileRevealed,
      nameVisible: effectiveNameRevealed,
      campaignNameRevealed: profile.nameRevealed,
      isAdmin,
    }
  );

  return (
    <div className="paper profile-panel">
      {variant === "page" ? (
        <p>
          <Link to="/?board=1" className="muted">
            ← Corkboard
          </Link>
        </p>
      ) : null}
      <div className="profile-header">
        <div>
          {showImage ? (
            <>
              <img src={profile.image} alt="" />
              {!isAdmin && isImageNew(profile, ack, vnRevealGate) ? (
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
            {dossierTitle}
            {!isAdmin && showName && isNameNew(profile, ack, vnRevealGate) ? (
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
          {entriesToShow.map((e) => {
            const showNew =
              !isAdmin &&
              effectiveProfileRevealed &&
              isEntryNew(profile.id, e.id, e.revealed, ack, vnRevealGate);

            return (
              <article key={e.id} className="entry-block">
                {isAdmin || showNew ? (
                  <div className="entry-head">
                    {isAdmin ? (
                      <>
                        <span className="muted">Note #{e.id}</span>
                        <span>
                          {showNew ? <span className="badge-new">NEW</span> : null}
                          <button
                            type="button"
                            className="btn btn-small"
                            onClick={() =>
                              setProfile(profile.id, (p) => ({
                                ...p,
                                entries: p.entries.map((x) =>
                                  x.id === e.id
                                    ? { ...x, revealed: !x.revealed }
                                    : x
                                ),
                              }))
                            }
                          >
                            {e.revealed ? "Un-reveal" : "Reveal publicly"}
                          </button>
                        </span>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                        }}
                      >
                        <span className="badge-new">NEW</span>
                      </div>
                    )}
                  </div>
                ) : null}
                <EntryText
                  text={e.text}
                  knownProfileIds={knownIds}
                  linkLabel={entryLinkLabel}
                  profileHref={variant === "modal" ? profileHref : undefined}
                />
              </article>
            );
          })}
        </section>
      ) : null}

      {isAdmin ? (
        <p className="muted" style={{ marginTop: "1.5rem", fontSize: "0.85rem" }}>
          Link to another dossier in text with <code>[[profile-id]]</code> (example:{" "}
          <code>[[sarah-chen]]</code>).
        </p>
      ) : null}
    </div>
  );
}
