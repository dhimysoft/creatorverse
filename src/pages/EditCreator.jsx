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
    </main>
  );
}
