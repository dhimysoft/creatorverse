// pages/ShowCreators.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";
import CreatorCard from "../components/CreatorCard";
import Icon from "../components/Icon";

export default function ShowCreators() {
  // Store the creators.
  const [creators, setCreators] = useState([]);

  // Track whether the creators are loading.
  const [loading, setLoading] = useState(true);

  // Store an error message.
  const [error, setError] = useState("");

  // Load the creators when the page opens.
  useEffect(() => {
    // useEffect itself must not be async, so the async function is declared
    // inside it and called on the last line.
    async function getCreators() {
      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")

        // Newest first, so a creator you just added is at the top rather than
        // somewhere down the grid.
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
          {/* Jumps down to the grid further along this same page. */}
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

        {/* was: <p>Loading creators…</p> — two words in the corner of an empty
            page, which reads as "broken" for the second it is on screen.
            Placeholder tiles in the shape of the real cards say "your creators
            are on their way" instead. */}
        {loading && (
          <section className="creator-grid">
            {[0, 1, 2].map((n) => (
              <div className="creator-card creator-card-skeleton" key={n} />
            ))}
          </section>
        )}

        {/* Show an error message. */}
        {!loading && error && (
          <p className="alert alert-error">Could not load creators: {error}</p>
        )}

        {/* Only shown once loading finished and the table really is empty. */}
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
              // key = the unique id React needs to tell list items apart.
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
