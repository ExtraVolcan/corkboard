import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

export function Layout() {
  const { isAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const wide = pathname.startsWith("/evidence");

  return (
    <div className="app-shell">
      <header className="top-nav">
        <NavLink to="/" className="brand" end>
          Mystery — Corkboard
        </NavLink>
        <nav className="tabs">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
            end
          >
            Profiles
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Evidence board
          </NavLink>
          {!isAdmin && (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Admin
            </NavLink>
          )}
        </nav>
        <div className="auth">
          {isAdmin ? (
            <>
              <span style={{ color: "#86efac", fontSize: "0.85rem" }}>Admin</span>
              <button type="button" className="btn btn-small" onClick={logout}>
                Log out
              </button>
            </>
          ) : null}
        </div>
      </header>
      <main className={`main-pad${wide ? " wide" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
