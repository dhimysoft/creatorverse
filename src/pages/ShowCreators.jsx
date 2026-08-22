import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../client'
import CreatorCard from '../components/CreatorCard'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCreators() {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) setError(fetchError.message)
      else setCreators(data ?? [])

      setLoading(false)
    }

    fetchCreators()
  }, [])

  return (
    <>
      <header className="hero">
        <p className="hero__eyebrow">A universe of people worth following</p>
        <h1 className="hero__title">CREATORVERSE</h1>
        <p className="hero__subtitle">
          Curate the creators who teach you, inspire you, and keep you building.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#creators">
            View all creators
          </a>
          <Link className="btn btn--outline" to="/new">
            Add a creator
          </Link>
        </div>
      </header>

      <main className="page" id="creators">
        <div className="section-heading">
          <h2>All creators</h2>
          {!loading && !error && (
            <span className="badge">
              {creators.length} {creators.length === 1 ? 'creator' : 'creators'}
            </span>
          )}
        </div>

        {loading && <p className="state">Loading creators…</p>}

        {!loading && error && (
          <p className="alert alert--error">
            Could not load creators: {error}
          </p>
        )}

        {!loading && !error && creators.length === 0 && (
          <div className="state state--empty">
            <h3>No creators yet</h3>
            <p>Your Creatorverse is empty. Add the first creator to get started.</p>
            <Link className="btn btn--primary" to="/new">
              Add a creator
            </Link>
          </div>
        )}

        {!loading && !error && creators.length > 0 && (
          <section className="creator-grid">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </section>
        )}
      </main>
    </>
  )
}
