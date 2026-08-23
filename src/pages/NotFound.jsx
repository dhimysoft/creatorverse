// NotFound.jsx - Shown for any URL that does not match a real route.
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page page-narrow state state-empty">
      <p className="notfound-code">404</p>

      <h1>Lost in the Creatorverse</h1>

      <p>That page drifted off into deep space. Let's get you back.</p>

      <Link className="btn btn-primary" to="/">
        Return home
      </Link>
    </main>
  );
}

export default NotFound;
