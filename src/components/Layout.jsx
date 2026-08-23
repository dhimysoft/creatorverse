// Provides the shared layout for every page.

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="app">
      <Navbar />

      {/* Renders the page that matches the current URL. */}
      <Outlet />

      <footer className="site-footer">
        <p className="site-footer-brand">Creatorverse</p>

        <p className="site-footer-tagline">
          Five creators worth following, and room for the rest.
        </p>

        <p className="site-footer-legal">
          © {new Date().getFullYear()} Dhimy Jean · CodePath WEB103 Prework
        </p>
      </footer>
    </div>
  );
}
