// Shown when a user visits a URL that does not exist in the app.

import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFoundPage() {
  return (
    <main className="page page-narrow state state-empty">
      <p className="notfound-code">404</p>

      <h1>Lost in the Creatorverse</h1>

      <p>That page drifted off into deep space. Let us get you back.</p>

      <Link className="btn btn-primary" to="/">
        <Icon name="arrowLeft" size={17} />
        Return home
      </Link>
    </main>
  );
}
