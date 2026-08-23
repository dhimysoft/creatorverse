// Page for adding a new creator.

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import CreatorForm from "../components/CreatorForm";
import Icon from "../components/Icon";

export default function AddCreator() {
  const navigate = useNavigate();

  // Save the new creator to Supabase.
  async function handleAdd(values) {
    const { error } = await supabase.from("creators").insert([values]);

    // Let CreatorForm display the error if the save fails.
    if (error) throw new Error(error.message);

    // Return to the homepage after the creator is saved.
    navigate("/");
  }

  return (
    <main className="page page-narrow">
      <Link className="back-link" to="/">
        <Icon name="arrowLeft" size={16} />
        Back to all creators
      </Link>

      <h1 className="page-title">Add a creator</h1>

      <p className="page-lead">
        Share someone worth following with the rest of the Creatorverse.
      </p>

      <CreatorForm submitLabel="Add creator" cancelTo="/" onSubmit={handleAdd} />
    </main>
  );
}