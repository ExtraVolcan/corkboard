import { EvidenceBoard } from "../pages/EvidenceBoard";
import { ProfilePanel } from "../pages/ProfilePanel";
import { useVn } from "../vn/state";

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function lineKey(sceneId: string, lineIndex: number) {
  return `${sceneId}::${lineIndex}`;
}

export function CorkboardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, currentScene, currentLine, dispatch } = useVn();

  const lk = lineKey(currentScene.id, state.lineIndex);
  const intr = currentLine?.interaction;
  const isEvidencePickLine =
    intr?.kind === "corkboardEntry" && state.interaction.lineKey === lk;

  if (!open) return null;

  if (isEvidencePickLine && intr.kind === "corkboardEntry") {
    return (
      <div
        className="corkboard-modal-overlay corkboard-modal-overlay--evidence-pick"
        role="presentation"
      >
        <div
          className="corkboard-modal-dialog corkboard-modal-dialog--evidence-pick"
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-challenge-question"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="evidence-challenge-head">
            <p
              id="evidence-challenge-question"
              className="evidence-challenge-question"
            >
              {intr.question}
            </p>
          </header>
          <div className="corkboard-modal-body corkboard-modal-body--evidence-pick">
            <ProfilePanel
              profileId={intr.profileId}
              variant="modal"
              evidenceChallengeSelection={{
                selectedEntryIds: state.interaction.selectedOptionIds,
                submitLabel: intr.submitLabel ?? "Submit evidence",
                onToggleEntrySelection: (profileId, entryId) => {
                  if (profileId !== intr.profileId) return;
                  dispatch({
                    type: "selectEvidenceEntry",
                    profileId: intr.profileId,
                    entryId,
                  });
                },
                onSubmit: () => dispatch({ type: "submitInteraction" }),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="corkboard-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="corkboard-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="corkboard-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="corkboard-modal-toolbar">
          <h2 id="corkboard-modal-title" className="corkboard-modal-title">
            Corkboard
          </h2>
          <button
            type="button"
            className="vn-icon-btn"
            onClick={onClose}
            title="Close corkboard"
            aria-label="Close corkboard"
          >
            <IconClose />
          </button>
        </div>
        <div className="corkboard-modal-body">
          <EvidenceBoard variant="modal" />
        </div>
      </div>
    </div>
  );
}
