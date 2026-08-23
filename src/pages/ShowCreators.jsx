// ShowCreators.jsx - The home page. Loads every creator and displays them.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../client.js";
import CreatorCard from "../components/CreatorCard.jsx";

function ShowCreators() {
  // Stores the creators and the request status.
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Loads the creators when the page opens.
  useEffect(() => {
    // The async function is declared inside the effect because useEffect
    // itself must not be async, then it is called on the line below.
    async function fetchCreators() {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false }); // newest creator first

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setCreators(data ?? []);
      }

      setLoading(false);
    }

    fetchCreators();
  }, []); // run once

  return (
    <>
      <header className="hero">
        <p className="hero-eyebrow">A universe of people worth following</p>

        <h1 className="hero-title">CREATORVERSE</h1>

        <p className="hero-subtitle">
          Curate the creators who teach you, inspire you, and keep you building.
        </p>

        <div className="hero-actions">
          {/* #creators jumps down to the grid on this same page. */}
          <a className="btn btn-primary" href="#creators">
            View all creators
          </a>

          <Link className="btn btn-outline" to="/new">
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

        {loading && <p className="state">Loading creators...</p>}

        {!loading && error && (
          <p className="alert alert-error">Could not load creators: {error}</p>
        )}

        {/* Shown only once loading finished and the table really is empty. */}
        {!loading && !error && creators.length === 0 && (
          <div className="state state-empty">
            <h3>No creators yet</h3>

            <p>
              Your Creatorverse is empty. Add the first creator to get started.
            </p>

            <Link className="btn btn-primary" to="/new">
              Add a creator
            </Link>
          </div>
        )}

        {/* Displays one card for each creator. */}
        {!loading && !error && creators.length > 0 && (
          <section className="creator-grid">
            {creators.map((creator) => (
              // key = the unique id React needs for each list item
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default ShowCreators;
