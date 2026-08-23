// pages/EditCreator.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";
import CreatorForm from "../components/CreatorForm";
import Icon from "../components/Icon";

export default function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Store the creator being edited.
  const [creator, setCreator] = useState(null);

  // Track whether the creator is loading.
  const [loading, setLoading] = useState(true);

  // Store an error message.
  const [error, setError] = useState("");

  // Track whether a delete is in flight.
  const [deleting, setDeleting] = useState(false);

  // Fetch before rendering the form, because the boxes have to open already
  // filled in rather than empty.
  useEffect(() => {
    async function getCreator() {
      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
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

  async function handleUpdate(values) {
    const { error: updateError } = await supabase
      .from("creators")
      .update(values)

      // Without .eq this would overwrite every row in the table.
      .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    // Back to the details page, where the change is visible straight away.
    navigate(`/creator/${id}`);
  }

  async function handleDelete() {
    // Ask first. A delete cannot be undone.
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
      <main className="page page-narrow">
        <div className="creator-form creator-form-skeleton" />
      </main>
    );
  }

  // Show an error message.
  if (error) {
    return (
      <main className="page page-narrow">
        <p className="alert alert-error">{error}</p>

        <Link className="btn btn-ghost" to="/">
          <Icon name="arrowLeft" size={16} />
          Back to all creators
        </Link>
      </main>
    );
  }

  return (
    <main className="page page-narrow">
      <Link className="back-link" to={`/creator/${id}`}>
        <Icon name="arrowLeft" size={16} />
        Back to {creator.name}
      </Link>

      <h1 className="page-title">Edit creator</h1>

      <p className="page-lead">Update the details for {creator.name}.</p>

      {/* initialValues is what fills the boxes before the user types. */}
      <CreatorForm
        initialValues={creator}
        submitLabel="Save changes"
        cancelTo={`/creator/${id}`}
        onSubmit={handleUpdate}
      />

      {/* Step 9 of the prework puts a delete button on this page. It is kept
          apart from the form so that "save" and "destroy" are never adjacent
          buttons someone can hit by muscle memory. */}
      <section className="danger-zone">
        <h2>Delete this creator</h2>

        <p>
          Removes {creator.name} from the Creatorverse for good. This cannot be
          undone.
        </p>

        <button
          className="btn btn-danger"
          type="button"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Icon name="trash" size={16} />
          {deleting ? "Deleting…" : "Delete creator"}
        </button>
      </section>
    </main>
  );
}
