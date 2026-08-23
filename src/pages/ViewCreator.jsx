// Details page for one creator, with Edit and Delete.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";
import Icon from "../components/Icon";

export default function ViewCreator() {
  // The :id in the URL tells us which creator to load.
  const { id } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load this creator from Supabase when the page opens.
  useEffect(() => {
    async function getCreator() {
      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")

        .eq("id", id)

        // maybeSingle gives back null instead of an error if the id is not
        // in the table, which is easier to show to the user.
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
    // Ask first, since deleting cannot be undone.
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

    // Send the user home once the creator is gone.
    navigate("/");
  }

  if (loading) {
    return (
      <main className="page">
        <div className="detail detail-skeleton" />
      </main>
    );
  }

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
        {/* Only show the image if this creator has one. */}
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
