import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../client'
import CreatorForm from '../components/CreatorForm'

export default function EditCreator() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  async function handleUpdate(values) {
    const { error: updateError } = await supabase
      .from('creators')
      .update(values)
      .eq('id', id)

    if (updateError) throw new Error(updateError.message)
    navigate(`/creator/${id}`)
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
    <main className="page page--narrow">
      <Link className="back-link" to={`/creator/${id}`}>
        ← Back to {creator.name}
      </Link>

      <h1 className="page__title">Edit creator</h1>
      <p className="page__lead">Update the details for {creator.name}.</p>

      <CreatorForm
        initialValues={creator}
        submitLabel="Save changes"
        cancelTo={`/creator/${id}`}
        onSubmit={handleUpdate}
      />
    </main>
  )
}
