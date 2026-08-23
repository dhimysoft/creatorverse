// components/Navbar.jsx

import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        <Icon name="sparkle" size={20} className="navbar-mark" />
        Creatorverse
      </Link>

      <div className="navbar-links">
        <Link to="/">All creators</Link>

        <Link className="btn btn-primary btn-sm" to="/new">
          <Icon name="plus" size={16} />
          Add a creator
        </Link>
      </div>
    </nav>
  );
}
