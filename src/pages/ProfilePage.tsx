import { useParams } from "react-router-dom";
import { ProfilePanel } from "./ProfilePanel";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return (
      <div className="paper">
        <p>Profile not found.</p>
      </div>
    );
  }
  return <ProfilePanel profileId={id} variant="page" />;
}
