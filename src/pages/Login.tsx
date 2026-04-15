import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useCampaign } from "../campaign";

export function Login() {
  const { isAdmin, login } = useAuth();
  const { refresh } = useCampaign();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  if (isAdmin) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const ok = await login(password);
    setBusy(false);
    if (ok) {
      await refresh(true);
      navigate("/", { replace: true });
    }
    else setError(true);
  }

  return (
    <div className="paper login-panel">
      <h1>Admin</h1>
      <form onSubmit={onSubmit}>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
        </label>
        {error ? <p className="error">Incorrect password.</p> : null}
        <p style={{ marginTop: "0.75rem" }}>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </p>
      </form>
      <p className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        Password is validated on the server (<code>ADMIN_PASSWORD</code> env var),
        not in the frontend bundle.
      </p>
    </div>
  );
}
