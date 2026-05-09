import { Link } from "react-router-dom";
import { parseEntryText } from "../links";

type Props = {
  text: string;
  knownProfileIds: Set<string>;
  /** When set, link text uses this (e.g. profile display name) instead of the raw [[id]]. */
  linkLabel?: (profileId: string) => string;
  /** When set, dossier links use this URL (e.g. stay on story with query params). */
  profileHref?: (profileId: string) => string;
};

export function EntryText({ text, knownProfileIds, linkLabel, profileHref }: Props) {
  const segments = parseEntryText(text);
  return (
    <p className="entry-text">
      {segments.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        const known = knownProfileIds.has(seg.profileId);
        const display = linkLabel ? linkLabel(seg.profileId) : seg.label;
        const to = profileHref
          ? profileHref(seg.profileId)
          : `/profile/${seg.profileId}`;
        return (
          <Link
            key={i}
            to={to}
            className="profile-link"
            style={{
              opacity: known ? 1 : 0.55,
            }}
          >
            {known ? display : `${display}?`}
          </Link>
        );
      })}
    </p>
  );
}
