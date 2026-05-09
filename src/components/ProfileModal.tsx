import { ProfilePanel } from "../pages/ProfilePanel";

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function ProfileModal({
  profileId,
  onClose,
}: {
  profileId: string;
  onClose: () => void;
}) {
  return (
    <div
      className="profile-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="profile-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-toolbar">
          <h2 id="profile-modal-title" className="profile-modal-title">
            Dossier
          </h2>
          <button
            type="button"
            className="vn-icon-btn"
            onClick={onClose}
            title="Close dossier"
            aria-label="Close dossier"
          >
            <IconClose />
          </button>
        </div>
        <div className="profile-modal-body">
          <ProfilePanel
            profileId={profileId}
            variant="modal"
            onCloseModal={onClose}
          />
        </div>
      </div>
    </div>
  );
}
