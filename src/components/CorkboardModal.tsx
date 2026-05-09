import { EvidenceBoard } from "../pages/EvidenceBoard";

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function CorkboardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

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
