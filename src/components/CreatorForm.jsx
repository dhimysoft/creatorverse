// Shared form used by both the Add and the Edit page.
// Each page passes its own onSubmit, so the fields are only written once.

import { useState } from "react";
import { Link } from "react-router-dom";

export default function CreatorForm({
  initialValues,
  submitLabel,
  cancelTo = "/",
  onSubmit,
}) {
  // The Edit page passes initialValues, the Add page starts empty.
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    url: initialValues?.url ?? "",
    description: initialValues?.description ?? "",
    imageurl: initialValues?.imageurl ?? "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // One handler for all the inputs, matched by each input's name.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    // Stop the browser reloading the page.
    event.preventDefault();

    setError("");

    // Stops a double submit while the save is running.
    setSaving(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),

        // The image is optional, so an empty box is saved as null.
        imageurl: form.imageurl.trim() || null,
      });
    } catch (submitError) {
      // Keep what the user typed so a failed save does not lose their work.
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

        {/* type="url" makes the browser check this looks like a real link. */}
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

      {/* Show any database error right above the buttons. */}
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
