// components/Layout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="app">
      {/* Show the navigation bar at the top of every page. */}
      <Navbar />

      {/* Show the page that matches the current route. */}
      <Outlet />

      <footer className="site-footer">
        <p className="site-footer-brand">Creatorverse</p>

        <p className="site-footer-tagline">
          Five creators worth following, and room for the rest.
        </p>

        {/* Show the current year automatically. */}
        <p className="site-footer-legal">
          © {new Date().getFullYear()} Dhimy Jean · CodePath WEB103 Prework
        </p>
      </footer>
    </div>
  );
}
