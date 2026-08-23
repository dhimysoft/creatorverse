// components/Icon.jsx
//
// A small set of line icons, drawn as inline SVG.
//
// Why not the ✦ and ↗ characters this page used before? Those are glyphs from
// the operating system's font: they arrive in someone else's weight, they
// render differently on Windows, macOS and Android, and next to a 15px label
// they sit on the wrong baseline. A row of stray symbols standing in for icons
// is the usual giveaway that a page was assembled rather than designed.
//
// These take their colour from the text around them (`stroke="currentColor"`),
// so one icon works in the navbar, on a card and inside a red delete button
// without a second copy in a different colour.

const PATHS = {
  sparkle: (
    <>
      <path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2l-1.7-5.8L4.5 10.7 10.3 9 12 3.2Z" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m15 6 3 3" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>
  ),
};

export default function Icon({ name, size = 18, className = "" }) {
  const path = PATHS[name] || PATHS.grid;

  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Decorative: every icon here sits next to a text label that already
      // says the same thing, so a screen reader repeating it would be noise.
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}
