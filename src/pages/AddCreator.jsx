import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../client'
import CreatorForm from '../components/CreatorForm'

export default function AddCreator() {
  const navigate = useNavigate()

  async function handleAdd(values) {
    const { error } = await supabase.from('creators').insert([values])
    if (error) throw new Error(error.message)
    navigate('/')
  }

  return (
    <main className="page page--narrow">
      <Link className="back-link" to="/">
        ← Back to all creators
      </Link>

      <h1 className="page__title">Add a creator</h1>
      <p className="page__lead">
        Share someone worth following with the rest of the Creatorverse.
      </p>

      <CreatorForm submitLabel="Add creator" cancelTo="/" onSubmit={handleAdd} />
    </main>
  )
}
