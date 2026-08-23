// Shows one creator card on the homepage.

import { Link } from "react-router-dom";
import Icon from "./Icon";

// Placeholder used when a creator has no image, so every card stays the
// same size and the grid lines up.
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
  const { id, name, url, description, imageurl } = creator;

  return (
    <article className="creator-card">
      <Link className="creator-card-media" to={`/creator/${id}`}>
        <img
          src={imageurl || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          // Show the placeholder if the image link is broken.
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

          {/* Step 8a: users can edit a creator straight from the card. */}
          <Link className="btn btn-ghost btn-sm" to={`/creator/${id}/edit`}>
            <Icon name="pencil" size={15} />
            Edit
          </Link>

          {/* Link to the creator's real channel, opened in a new tab. */}
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
