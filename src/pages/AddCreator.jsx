// Page for adding a new creator.

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import CreatorForm from "../components/CreatorForm";
import Icon from "../components/Icon";

export default function AddCreator() {
  const navigate = useNavigate();

  // CreatorForm calls this with whatever was typed into the form.
  async function handleAdd(values) {
    const { error } = await supabase.from("creators").insert([values]);

    // Throwing lets CreatorForm show the error without clearing the form.
    if (error) throw new Error(error.message);

    // The new creator now shows on the homepage.
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
