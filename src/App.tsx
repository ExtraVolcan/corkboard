import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProfilePage } from "./pages/ProfilePage";
import { VisualNovelPage } from "./pages/VisualNovelPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<VisualNovelPage />} />
        <Route path="corkboard" element={<Navigate to="/?board=1" replace />} />
        <Route path="evidence" element={<Navigate to="/?board=1" replace />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
