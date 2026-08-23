// Page for editing or deleting one creator.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";
import CreatorForm from "../components/CreatorForm";
import Icon from "../components/Icon";

export default function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load the creator's saved details so the form can be filled in.
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
    // Update only the creator selected in the URL.
    const { error: updateError } = await supabase
      .from("creators")
      .update(values)
      .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    // Return to the details page after saving.
    navigate(`/creator/${id}`);
  }

  async function handleDelete() {
    // Ask for confirmation because deleting cannot be undone.
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

    // Return home after the creator is deleted.
    navigate("/");
  }

  if (loading) {
    return (
      <main className="page page-narrow">
        <div className="creator-form creator-form-skeleton" />
      </main>
    );
  }

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

      {/* Fill the form with the creator's current details. */}
      <CreatorForm
        initialValues={creator}
        submitLabel="Save changes"
        cancelTo={`/creator/${id}`}
        onSubmit={handleUpdate}
      />

      {/* Step 9: the delete button is on the edit page. */}
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