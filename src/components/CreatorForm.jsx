// CreatorForm.jsx - The shared form used by BOTH the add page and the edit
// page. Each page passes in its own onSubmit function, so the fields and the
// validation only have to be written once.
import { useState } from "react";
import { Link } from "react-router-dom";

function CreatorForm({ initialValues, submitLabel, cancelTo = "/", onSubmit }) {
  // One state object holds all four fields. On the edit page initialValues
  // arrives filled in; on the add page it is undefined, so ?? gives "".
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    url: initialValues?.url ?? "",
    description: initialValues?.description ?? "",
    imageurl: initialValues?.imageurl ?? "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // One handler for every input. event.target.name matches the key in state,
  // so [name] updates just the field the user typed in.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page
    setError("");
    setSaving(true); // disables the button so a slow save can't be sent twice

    try {
      await onSubmit({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        // The database column allows NULL, so an empty box is stored as null
        // rather than as an empty string.
        imageurl: form.imageurl.trim() || null,
      });
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
      setSaving(false); // let the user fix it and try again
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
        <input
          name="url"
          type="url" // the browser checks it looks like a real address
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
          Image URL <span className="field-hint">(optional)</span>
        </span>
        <input
          name="imageurl"
          type="url"
          value={form.imageurl}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
      </label>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="creator-form-actions">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>

        <Link className="btn btn-ghost" to={cancelTo}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default CreatorForm;
