// components/CreatorCard.jsx

import { Link } from "react-router-dom";
import Icon from "./Icon";

// A grey "No image" tile drawn as SVG and stored as a data URL. A creator with
// no picture still gets a card the same height as the others, so one missing
// image does not knock a row of the grid out of alignment. It sits outside the
// component because it never changes and would otherwise be rebuilt on every
// render.
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
       <rect width="400" height="260" fill="#16213f"/>
       <text x="50%" y="52%" text-anchor="middle" fill="#5f7bb3"
             font-family="system-ui,sans-serif" font-size="22">No image</text>
     </svg>`,
  );

export default function CreatorCard({ creator }) {
  // Pull the four database columns off the row this card was handed.
  const { id, name, url, description, imageurl } = creator;

  return (
    <article className="creator-card">
      <Link className="creator-card-media" to={`/creator/${id}`}>
        <img
          // imageurl is null when the creator has no picture.
          src={imageurl || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          // Runs when a link is dead, so a broken URL shows the placeholder
          // rather than the browser's torn-image icon.
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
          <Link className="btn btn-ghost btn-sm" to={`/creator/${id}`}>
            View details
          </Link>

          {/* The creator's real channel. target="_blank" opens a new tab, and
              rel="noopener noreferrer" is the safety pair that goes with it. */}
          <a
            className="link-external"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit channel
            <Icon name="external" size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
