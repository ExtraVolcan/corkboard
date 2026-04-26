import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminCampaign } from "./pages/AdminCampaign";
import { StoryEditorPage } from "./pages/StoryEditorPage";
import { EvidenceBoard } from "./pages/EvidenceBoard";
import { Login } from "./pages/Login";
import { ProfilePage } from "./pages/ProfilePage";
import { VisualNovelPage } from "./pages/VisualNovelPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<VisualNovelPage />} />
        <Route path="corkboard" element={<EvidenceBoard />} />
        <Route path="evidence" element={<Navigate to="/corkboard" replace />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="login" element={<Login />} />
        <Route path="admin/story" element={<StoryEditorPage />} />
        <Route path="admin" element={<AdminCampaign />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
