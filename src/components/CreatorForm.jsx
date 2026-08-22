import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function CreatorForm({
  initialValues,
  submitLabel,
  cancelTo = '/',
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: initialValues?.name ?? '',
    url: initialValues?.url ?? '',
    description: initialValues?.description ?? '',
    imageurl: initialValues?.imageurl ?? '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await onSubmit({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        imageurl: form.imageurl.trim() || null,
      })
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <form className="creator-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">Name</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Fireship"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">Channel or page URL</span>
        <input
          name="url"
          type="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://www.youtube.com/@example"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">Description</span>
        <textarea
          name="description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          placeholder="What do they make, and why is it worth following?"
          required
        />
      </label>

      <label className="field">
        <span className="field__label">
          Image URL <span className="field__hint">(optional)</span>
        </span>
        <input
          name="imageurl"
          type="url"
          value={form.imageurl}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
      </label>

      {error && <p className="alert alert--error">{error}</p>}

      <div className="creator-form__actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
        <Link className="btn btn--ghost" to={cancelTo}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
