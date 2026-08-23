// AddCreator.jsx - Form page for creating a brand new creator.
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../client.js";
import CreatorForm from "../components/CreatorForm.jsx";

function AddCreator() {
  const navigate = useNavigate();

  // Handed to CreatorForm, which calls it with the typed-in values.
  async function handleAdd(values) {
    const { error } = await supabase.from("creators").insert([values]);

    if (error) {
      // Throwing sends the message back to CreatorForm, which shows it
      // above the buttons instead of losing what the user typed.
      throw new Error(error.message);
    }

    navigate("/"); // homepage, where the new card now appears
  }

  return (
    <main className="page page-narrow">
      <Link className="back-link" to="/">
        ← Back to all creators
      </Link>

      <h1 className="page-title">Add a creator</h1>

      <p className="page-lead">
        Share someone worth following with the rest of the Creatorverse.
      </p>

      <CreatorForm submitLabel="Add creator" cancelTo="/" onSubmit={handleAdd} />
    </main>
  );
}

export default AddCreator;
