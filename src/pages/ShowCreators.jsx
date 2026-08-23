// Homepage: loads every creator and shows them as cards.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import CreatorCard from "../components/CreatorCard";
import Icon from "../components/Icon";

export default function ShowCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load creators from Supabase when the page opens.
  useEffect(() => {
    // useEffect cannot be async itself, so the function goes inside it.
    async function getCreators() {
      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")

        // Newest first, so a creator you just added shows at the top.
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setCreators(data ?? []);
      }

      setLoading(false);
    }

    getCreators();
  }, []);

  return (
    <>
      <header className="hero">
        <p className="hero-eyebrow">A universe of people worth following</p>

        <h1 className="hero-title">CREATORVERSE</h1>

        <p className="hero-subtitle">
          Curate the creators who teach you, inspire you, and keep you building.
        </p>

        <div className="hero-actions">
          {/* Jumps down to the grid below. */}
          <a className="btn btn-primary" href="#creators">
            <Icon name="grid" size={17} />
            View all creators
          </a>

          <Link className="btn btn-outline" to="/new">
            <Icon name="plus" size={17} />
            Add a creator
          </Link>
        </div>
      </header>

      <main className="page" id="creators">
        <div className="section-heading">
          <h2>All creators</h2>

          {!loading && !error && (
            <span className="badge">
              {creators.length} {creators.length === 1 ? "creator" : "creators"}
            </span>
          )}
        </div>

        {/* Placeholder cards while the data loads, so the page does not look
            broken for a second. */}
        {loading && (
          <section className="creator-grid">
            {[0, 1, 2].map((n) => (
              <div className="creator-card creator-card-skeleton" key={n} />
            ))}
          </section>
        )}

        {!loading && error && (
          <p className="alert alert-error">Could not load creators: {error}</p>
        )}

        {/* Empty state, shown only when there are really no creators yet. */}
        {!loading && !error && creators.length === 0 && (
          <div className="state state-empty">
            <h3>No creators yet</h3>

            <p>
              Your Creatorverse is empty. Add the first creator to get started.
            </p>

            <Link className="btn btn-primary" to="/new">
              <Icon name="plus" size={17} />
              Add a creator
            </Link>
          </div>
        )}

        {/* Show one card for each creator. */}
        {!loading && !error && creators.length > 0 && (
          <section className="creator-grid">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
