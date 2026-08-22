import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../client'

export default function ViewCreator() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchCreator() {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (fetchError) setError(fetchError.message)
      else if (!data) setError('That creator does not exist.')
      else setCreator(data)

      setLoading(false)
    }

    fetchCreator()
  }, [id])

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${creator.name}? This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('creators')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
      return
    }

    navigate('/')
  }

  if (loading) {
    return (
      <main className="page">
        <p className="state">Loading creator…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <p className="alert alert--error">{error}</p>
        <Link className="btn btn--ghost" to="/">
          ← Back to all creators
        </Link>
      </main>
    )
  }

  return (
    <main className="page">
      <Link className="back-link" to="/">
        ← Back to all creators
      </Link>

      <article className="detail">
        {creator.imageurl && (
          <div className="detail__media">
            <img src={creator.imageurl} alt={creator.name} />
          </div>
        )}

        <div className="detail__body">
          <h1 className="detail__name">{creator.name}</h1>
          <p className="detail__description">{creator.description}</p>

          <a
            className="link-external"
            href={creator.url}
            target="_blank"
            rel="noreferrer"
          >
            Visit {creator.name}'s channel ↗
          </a>

          <div className="detail__actions">
            <Link className="btn btn--primary" to={`/creator/${id}/edit`}>
              Edit
            </Link>
            <button
              className="btn btn--danger"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </article>
    </main>
  )
}
