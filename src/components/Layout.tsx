import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

export function Layout() {
  const { isAdmin, logout } = useAuth();
  const { pathname, search } = useLocation();
  const boardOpen = new URLSearchParams(search).get("board") === "1";
  const storyTabActive = pathname === "/" && !boardOpen;
  const corkTabActive = pathname === "/" && boardOpen;
  const wide =
    pathname === "/" ||
    pathname.startsWith("/admin");
  const flushVn = pathname === "/";

  return (
    <div className="app-shell">
      <header className="top-nav">
        <NavLink to="/" className="brand" end>
          Mystery VN
        </NavLink>
        <nav className="tabs">
          <NavLink
            to="/"
            className={() => (storyTabActive ? "active" : "")}
            end
          >
            Story
          </NavLink>
          <NavLink to="/?board=1" className={() => (corkTabActive ? "active" : "")}>
            Corkboard
          </NavLink>
          {isAdmin ? (
            <>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Edit campaign
              </NavLink>
              <NavLink
                to="/admin/story"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Edit story
              </NavLink>
            </>
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
      <main
        className={`main-pad${wide ? " wide" : ""}${
          flushVn ? " main-pad--vn" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
