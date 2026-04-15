import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { EvidenceBoard } from "./pages/EvidenceBoard";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ProfilePage } from "./pages/ProfilePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="evidence" element={<EvidenceBoard />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
