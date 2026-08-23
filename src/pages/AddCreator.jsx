// pages/AddCreator.jsx

import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import CreatorForm from "../components/CreatorForm";
import Icon from "../components/Icon";

export default function AddCreator() {
  const navigate = useNavigate();

  // Handed to CreatorForm, which calls it with the values that were typed in.
  async function handleAdd(values) {
    const { error } = await supabase.from("creators").insert([values]);

    // Throwing sends the message back to CreatorForm, which shows it above the
    // buttons without clearing the form.
    if (error) throw new Error(error.message);

    // Homepage, where the new card is now at the top of the grid.
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
