import { Link } from "react-router-dom";
import { parseEntryText } from "../links";

type Props = {
  text: string;
  knownProfileIds: Set<string>;
};

export function EntryText({ text, knownProfileIds }: Props) {
  const segments = parseEntryText(text);
  return (
    <p className="entry-text">
      {segments.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        const known = knownProfileIds.has(seg.profileId);
        return (
          <Link
            key={i}
            to={`/profile/${seg.profileId}`}
            className="profile-link"
            style={{
              opacity: known ? 1 : 0.55,
            }}
          >
            {known ? seg.label : `${seg.label}?`}
          </Link>
        );
      })}
    </p>
  );
}
