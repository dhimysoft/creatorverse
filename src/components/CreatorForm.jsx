// Form used on both the Add Creator and Edit Creator pages.

import { useState } from "react";
import { Link } from "react-router-dom";
import { describeError } from "../errorMessage";

export default function CreatorForm({
  initialValues,
  submitLabel,
  cancelTo = "/",
  onSubmit,
}) {
  // Edit starts with the creator's saved information. Add starts with empty fields.
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    url: initialValues?.url ?? "",
    description: initialValues?.description ?? "",
    imageurl: initialValues?.imageurl ?? "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Update the correct form field when the user types.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    // Prevent the page from reloading when the form is submitted.
    event.preventDefault();

    setError("");

    // Disable the button while the creator is being saved.
    setSaving(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),

        // Save an empty optional image field as null.
        imageurl: form.imageurl.trim() || null,
      });
    } catch (submitError) {
      // Keep the form information if saving fails.
      setError(describeError(submitError));
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

        {/* Checks that the user enters a valid URL. */}
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

      {/* Show a database error above the form buttons. */}
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