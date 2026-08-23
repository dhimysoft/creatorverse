// Navbar.jsx - Site header with the brand and the two main links.
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        <span className="navbar-mark">✦</span> Creatorverse
      </Link>

      <div className="navbar-links">
        <Link to="/">All creators</Link>

        <Link className="btn btn-primary btn-sm" to="/new">
          Add a creator
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
