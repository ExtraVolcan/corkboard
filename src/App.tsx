import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { EvidenceBoard } from "./pages/EvidenceBoard";
import { Login } from "./pages/Login";
import { ProfilePage } from "./pages/ProfilePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<EvidenceBoard />} />
        <Route path="evidence" element={<Navigate to="/" replace />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
