// Layout.jsx - The frame every page sits inside: navbar on top, footer below.
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Layout() {
  return (
    <div className="app">
      <Navbar />

      {/* Outlet is where React Router drops whichever page matched the URL. */}
      <Outlet />

      <Footer />
    </div>
  );
}

export default Layout;
