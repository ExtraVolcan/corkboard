import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

export function Layout() {
  const { isAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const wide =
    pathname === "/" ||
    pathname.startsWith("/evidence") ||
    pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      <header className="top-nav">
        <NavLink to="/" className="brand" end>
          Mystery — Corkboard
        </NavLink>
        <nav className="tabs">
          {isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Edit campaign
            </NavLink>
          ) : (
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
