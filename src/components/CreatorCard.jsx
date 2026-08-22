import { Link } from 'react-router-dom'

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
       <rect width="400" height="260" fill="#16213f"/>
       <text x="50%" y="52%" text-anchor="middle" fill="#5f7bb3"
             font-family="system-ui,sans-serif" font-size="22">No image</text>
     </svg>`
  )

export default function CreatorCard({ creator }) {
  const { id, name, url, description, imageurl } = creator

  return (
    <article className="creator-card">
      <Link className="creator-card__media" to={`/creator/${id}`}>
        <img
          src={imageurl || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE
          }}
        />
      </Link>

      <div className="creator-card__body">
        <h2 className="creator-card__name">
          <Link to={`/creator/${id}`}>{name}</Link>
        </h2>
        <p className="creator-card__description">{description}</p>

        <div className="creator-card__actions">
          <Link className="btn btn--ghost" to={`/creator/${id}`}>
            View details
          </Link>
          {url && (
            <a
              className="link-external"
              href={url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              Visit channel ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
