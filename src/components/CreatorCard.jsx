// CreatorCard.jsx - A reusable card for ONE creator.
// ShowCreators renders many of these with .map().
import { Link } from "react-router-dom";

// A grey "No image" tile drawn as an SVG and stored as a data URL, so a
// creator with no picture still gets a card the same size as the others.
// It lives outside the component because it never changes and would
// otherwise be rebuilt on every render.
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
       <rect width="400" height="260" fill="#16213f"/>
       <text x="50%" y="52%" text-anchor="middle" fill="#5f7bb3"
             font-family="system-ui,sans-serif" font-size="22">No image</text>
     </svg>`,
  );

function CreatorCard({ creator }) {
  // creator = the data ShowCreators hands to this card (a "prop").
  const { id, name, url, description, imageurl } = creator;

  return (
    <article className="creator-card">
      <Link className="creator-card-media" to={`/creator/${id}`}>
        <img
          src={imageurl || FALLBACK_IMAGE} // || falls back when imageurl is null or ""
          alt={name}
          loading="lazy"
          // Runs if the link is dead, so a broken URL shows the placeholder
          // instead of a torn-image icon.
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </Link>

      <div className="creator-card-body">
        <h2 className="creator-card-name">
          <Link to={`/creator/${id}`}>{name}</Link>
        </h2>

        <p className="creator-card-desc">{description}</p>

        <div className="creator-card-actions">
          <Link className="btn btn-ghost" to={`/creator/${id}`}>
            View details
          </Link>

          {/* The creator's real channel. target="_blank" opens a new tab and
              rel="noopener noreferrer" is the safety pair that goes with it. */}
          {url && (
            <a
              className="link-external"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit channel ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default CreatorCard; // export so ShowCreators can import it
