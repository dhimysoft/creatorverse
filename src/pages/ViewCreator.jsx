// pages/ViewCreator.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";
import Icon from "../components/Icon";

export default function ViewCreator() {
  // Read the :id out of the URL, e.g. 19 from /creator/19.
  const { id } = useParams();

  // Lets us send the user to another page from inside a function.
  const navigate = useNavigate();

  // Store the creator being viewed.
  const [creator, setCreator] = useState(null);

  // Track whether the creator is loading.
  const [loading, setLoading] = useState(true);

  // Store an error message.
  const [error, setError] = useState("");

  // Track whether a delete is in flight.
  const [deleting, setDeleting] = useState(false);

  // Load this one creator when the page opens.
  useEffect(() => {
    async function getCreator() {
      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")

        // Only the row whose id matches the URL.
        .eq("id", id)

        // maybeSingle returns one row, or null for a URL like /creator/999.
        // single() would throw instead, which is harder to show to the user.
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
      } else if (!data) {
        setError("That creator does not exist.");
      } else {
        setCreator(data);
      }

      setLoading(false);
    }

    getCreator();
  }, [id]);

  async function handleDelete() {
    // Ask first. A delete cannot be undone, and the button sits next to Edit.
    const confirmed = window.confirm(
      `Delete ${creator.name}? This cannot be undone.`,
    );

    if (!confirmed) return;

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

    // Back to the homepage, where the card is now gone.
    navigate("/");
  }

  if (loading) {
    return (
      <main className="page">
        <div className="detail detail-skeleton" />
      </main>
    );
  }

  // Show an error message.
  if (error) {
    return (
      <main className="page">
        <p className="alert alert-error">{error}</p>

        <Link className="btn btn-ghost" to="/">
          <Icon name="arrowLeft" size={16} />
          Back to all creators
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link className="back-link" to="/">
        <Icon name="arrowLeft" size={16} />
        Back to all creators
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
            Visit {creator.name} on their channel
            <Icon name="external" size={16} />
          </a>

          <div className="detail-actions">
            <Link className="btn btn-primary" to={`/creator/${id}/edit`}>
              <Icon name="pencil" size={16} />
              Edit
            </Link>

            <button
              className="btn btn-danger"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Icon name="trash" size={16} />
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
