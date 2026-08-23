// components/CreatorForm.jsx

// The add page and the edit page ask for exactly the same four fields. Each
// one passes its own onSubmit, so the inputs, the validation and the error
// handling are written here once rather than twice.

import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreatorForm({
  initialValues,
  submitLabel,
  cancelTo = "/",
  onSubmit,
}) {
  // Store the four fields. On the edit page initialValues arrives filled in;
  // on the add page it is undefined, so ?? falls back to an empty box.
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    url: initialValues?.url ?? "",
    description: initialValues?.description ?? "",
    imageurl: initialValues?.imageurl ?? "",
  });

  // Store an error from the database.
  const [error, setError] = useState("");

  // Track whether a save is in flight.
  const [saving, setSaving] = useState(false);

  // One handler for every input. event.target.name matches the key in state,
  // so [name] updates only the field being typed into.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    // Stop the browser reloading the page.
    event.preventDefault();

    setError("");

    // Disable the button so a slow save cannot be sent twice.
    setSaving(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),

        // The imageurl column allows NULL, so an empty box is stored as null
        // rather than as an empty string.
        imageurl: form.imageurl.trim() || null,
      });
    } catch (submitError) {
      // Keep what the user typed on screen. Wiping a filled-in form because
      // the network blinked is the fastest way to lose their work.
      setError(submitError.message || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form className="creator-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">Name</span>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Fireship"
          required
        />
      </label>

      <label className="field">
        <span className="field-label">Channel or page URL</span>

        {/* type="url" makes the browser check it looks like a real address
            before the form is allowed to submit. */}
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
        <span className="field-label">Description</span>

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
        <span className="field-label">
          Image URL <span className="field-hint">optional</span>
        </span>

        <input
          name="imageurl"
          type="url"
          value={form.imageurl}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
      </label>

      {/* Show the database error above the buttons, where the user is looking
          when they press save. */}
      {error && <p className="alert alert-error">{error}</p>}

      <div className="creator-form-actions">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>

        <Link className="btn btn-ghost" to={cancelTo}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
