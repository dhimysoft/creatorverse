// ViewCreator.jsx - Details page for ONE creator, plus Edit and Delete.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { supabase } from "../client.js";

function ViewCreator() {
  const { id } = useParams(); // the :id from the URL, e.g. /creator/19
  const navigate = useNavigate(); // lets us send the user to another page in code

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Loads this one creator whenever the id in the URL changes.
  useEffect(() => {
    async function fetchCreator() {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id) // only the row whose id matches the URL
        .maybeSingle(); // returns one row, or null instead of throwing

      if (fetchError) {
        setError(fetchError.message);
      } else if (!data) {
        setError("That creator does not exist.");
      } else {
        setCreator(data);
      }

      setLoading(false);
    }

    fetchCreator();
  }, [id]); // re-run if the user opens a different creator

  async function handleDelete() {
    // Ask first, because a delete cannot be undone.
    const confirmed = window.confirm(
      `Delete ${creator.name}? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    const { error: deleteError } = await supabase
      .from("creators")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
      return;
    }

    navigate("/"); // back to the homepage, where the card is now gone
  }

  if (loading) {
    return (
      <main className="page">
        <p className="state">Loading creator...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p className="alert alert-error">{error}</p>

        <Link className="btn btn-ghost" to="/">
          ← Back to all creators
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link className="back-link" to="/">
        ← Back to all creators
      </Link>

      <article className="detail">
        {/* Only render the image block when this creator actually has one. */}
        {creator.imageurl && (
          <div className="detail-media">
            <img src={creator.imageurl} alt={creator.name} />
          </div>
        )}

        <div className="detail-body">
          <h1 className="detail-name">{creator.name}</h1>

          <p className="detail-desc">{creator.description}</p>

          <a
            className="link-external"
            href={creator.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit {creator.name}'s channel ↗
          </a>

          <div className="detail-actions">
            <Link className="btn btn-primary" to={`/creator/${id}/edit`}>
              Edit
            </Link>

            <button
              className="btn btn-danger"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}

export default ViewCreator;
