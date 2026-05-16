import { useCallback, useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
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

export type EvidenceChallengeSelectionProps = {
  selectedEntryIds?: string[];
  submitLabel?: string;
  onToggleEntrySelection: (profileId: string, entryId: string) => void;
  onSubmit: () => void;
};

export function ProfilePanel({
  profileId,
  variant,
  onCloseModal,
  evidenceChallengeSelection,
}: {
  profileId: string;
  variant: "page" | "modal";
  onCloseModal?: () => void;
  /** One intel entry chosen from this dossier; used by VN corkboard evidence challenges. */
  evidenceChallengeSelection?: EvidenceChallengeSelectionProps;
}) {
  const { data, ack, mergeAck } = useCampaign();
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

  const entriesToShow = useMemo(
    () =>
      (profile?.entries ?? []).filter(
        (e) => e.revealed || isEntryVisible(profile?.id ?? "", e.id)
      ),
    [profile?.entries, profile?.id, isEntryVisible]
  );

  const showEntriesSection = useMemo(() => {
    if (!profile) return false;
    return profile.entries.some(
      (e) => e.revealed || isEntryVisible(profile.id, e.id)
    );
  }, [profile, isEntryVisible]);

  const entryLinkLabel = useCallback(
    (pid: string) => {
      const t = findProfileWithSeedFallback(data.profiles, pid);
      if (!t) return pid;
      const profileVis = t.profileRevealed || isProfileVisible(t.id);
      const nameVis = t.nameRevealed || isNameVisible(t.id);
      const override = vnState.profileDisplayNames[pid];
      if (!profileVis) return "?";
      if (override !== undefined && override !== "") return override.trim();
      if (nameVis) return t.name.trim();
      return "?";
    },
    [data.profiles, isProfileVisible, isNameVisible, vnState.profileDisplayNames]
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
      const tokens = new Set(visibleTokensAfterVisit(profile));
      if (isNameVisible(profile.id)) tokens.add("__name__");
      if (isImageVisible(profile.id)) tokens.add("__image__");
      for (const e of profile.entries) {
        if (isEntryVisible(profile.id, e.id)) tokens.add(e.id);
      }
      mergeAck(profileId, [...tokens]);
    };
  }, [profileId, profile, mergeAck, isNameVisible, isImageVisible, isEntryVisible]);

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

  const evidencePick = Boolean(evidenceChallengeSelection);
  const effectiveProfileRevealed =
    profile.profileRevealed || isProfileVisible(profile.id);
  const effectiveNameRevealed =
    profile.nameRevealed || isNameVisible(profile.id);
  const effectiveImageRevealed =
    profile.imageRevealed || isImageVisible(profile.id);

  if (!effectiveProfileRevealed) {
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

  const showName = effectiveProfileRevealed && effectiveNameRevealed;
  const showImage = effectiveProfileRevealed && effectiveImageRevealed;
  const dossierTitle = polaroidCaptionFromCampaign(
    profile.name,
    vnState.profileDisplayNames,
    profile.id,
    {
      profileVisible: effectiveProfileRevealed,
      nameVisible: effectiveNameRevealed,
    }
  );

  const evidenceCtl = evidencePick ? evidenceChallengeSelection : null;

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
              {isImageNew(profile, ack, vnRevealGate) ? (
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
            {showName && isNameNew(profile, ack, vnRevealGate) ? (
              <>
                {" "}
                <span className="badge-new">NEW</span>
              </>
            ) : null}
          </h1>
        </div>
      </div>

      {showEntriesSection ? (
        <section
          style={{ marginTop: "1.25rem" }}
          className={evidencePick ? "profile-entries-evidence-pick" : undefined}
        >
          {entriesToShow.map((e) => {
            const showNew =
              effectiveProfileRevealed &&
              isEntryNew(profile.id, e.id, e.revealed, ack, vnRevealGate);
            const selId = evidenceCtl?.selectedEntryIds?.[0];
            const isSelected = selId === e.id;

            return (
              <article
                key={e.id}
                role={evidencePick ? "button" : undefined}
                tabIndex={evidencePick ? 0 : undefined}
                aria-pressed={evidencePick ? isSelected : undefined}
                aria-label={
                  evidencePick
                    ? isSelected
                      ? `${e.id}: selected intel`
                      : `${e.id}: select this intel`
                    : undefined
                }
                className={`entry-block${
                  evidencePick ? " entry-block--evidence-pickable" : ""
                }${isSelected ? " entry-block--selected" : ""}`}
                onClick={
                  evidencePick && evidenceCtl
                    ? () =>
                        evidenceCtl.onToggleEntrySelection(
                          profile.id,
                          e.id
                        )
                    : undefined
                }
                onKeyDown={
                  evidencePick && evidenceCtl
                    ? (evt) => {
                        if (
                          evt.key !== "Enter" &&
                          evt.key !== " "
                        )
                          return;
                        evt.preventDefault();
                        evidenceCtl.onToggleEntrySelection(
                          profile.id,
                          e.id
                        );
                      }
                    : undefined
                }
              >
                {showNew ? (
                  <div className="entry-head">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <span className="badge-new">NEW</span>
                    </div>
                  </div>
                ) : null}
                <EntryText
                  text={e.text}
                  knownProfileIds={knownIds}
                  linkLabel={entryLinkLabel}
                  profileHref={variant === "modal" ? profileHref : undefined}
                  suppressProfileLinks={evidencePick}
                />
              </article>
            );
          })}
        </section>
      ) : null}
      {evidencePick && evidenceCtl ? (
        <div className="evidence-challenge-submit-wrap">
          <button
            type="button"
            className="btn btn-primary evidence-challenge-submit"
            disabled={!evidenceCtl.selectedEntryIds?.length}
            onClick={() => evidenceCtl.onSubmit()}
          >
            {evidenceCtl.submitLabel ?? "Submit evidence"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
