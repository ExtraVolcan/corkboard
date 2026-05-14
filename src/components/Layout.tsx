import { NavLink, Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const { pathname, search } = useLocation();
  const boardOpen = new URLSearchParams(search).get("board") === "1";
  const storyTabActive = pathname === "/" && !boardOpen;
  const corkTabActive = pathname === "/" && boardOpen;
  const wide = pathname === "/";
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
        </nav>
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
