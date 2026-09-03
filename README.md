# Creatorverse

A full CRUD React app for curating content creators worth following. Creators
are stored in a Supabase (PostgreSQL) database and shown in a responsive card
grid — you can browse, view, add, edit, and delete them.

Built by **Dhimy Jean** as the CodePath **WEB103 prework** assignment, then
extended past the requirements (see the checklist further down for exactly what
was required versus what was added).

- **Repository:** https://github.com/dhimysoft/creatorverse
- **Deployment:** https://creatorverse-gilt.vercel.app/
- **Walkthrough video:** https://youtu.be/GgjnfFbihpE

> ⚠️ **The hosted demo is currently offline.** The Supabase project behind it no
> longer resolves — free Supabase projects are paused and eventually removed
> after a period of inactivity. The app itself is fine and runs locally in a few
> minutes using the setup below; `supabase/schema.sql` and
> `supabase/seed-creators.sql` recreate the database exactly.

---

## The problem it solves

If you follow a lot of creators across YouTube, Twitch, newsletters and
podcasts, the list lives in bookmarks, screenshots and memory. Creatorverse is a
small, single-purpose place to keep that list — who they are, where to find them,
and why they are worth your time.

**Intended user:** one person curating their own list. There are no accounts;
everyone sees the same shared list.

---

## Features

All verified working locally:

- Browse every creator in a responsive card grid
- View one creator on their own URL
- Add a creator (name, URL and description required; image optional)
- Edit any creator
- Delete a creator, behind a confirmation dialog that names them
- Proper **loading**, **empty**, **error** and **success** states on every page
  that touches the database
- A placeholder image when a creator has no photo, plus a fallback when an image
  URL is broken
- A dedicated 404 page for unknown URLs
- Keyboard focus rings and `prefers-reduced-motion` support

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite |
| Routing | React Router |
| Database | Supabase (hosted PostgreSQL) |
| Data access | `@supabase/supabase-js` from the browser |
| Styling | Hand-written CSS with custom properties — no UI framework |
| Tests | Vitest + React Testing Library |
| Hosting | Vercel |

## Architecture

There is **no backend of my own**. The React app talks straight to Supabase,
which provides the PostgreSQL database and its REST API.

```
React (Vite)
   │  supabase-js
   ▼
Supabase REST API
   ▼
PostgreSQL — a single "creators" table
```

`src/client.js` creates one Supabase client that every page imports. Each page
owns its own data fetching and its own loading/error state — there is no global
state library, because with one table and five pages there is nothing to share.

```
src/
├── client.js              one Supabase client, shared
├── errorMessage.js        turns raw errors into readable sentences
├── components/
│   ├── CreatorCard.jsx    one card in the grid
│   ├── CreatorForm.jsx    shared by Add and Edit
│   ├── Icon.jsx           inline SVG icons
│   ├── Layout.jsx         page shell
│   └── Navbar.jsx
└── pages/
    ├── ShowCreators.jsx   homepage list
    ├── ViewCreator.jsx    one creator
    ├── AddCreator.jsx
    ├── EditCreator.jsx
    └── NotFoundPage.jsx
```

---

## Running it locally

You need **Node 18+** and a free Supabase account.

**1. Install**

```bash
npm install
```

**2. Create the database**

In your Supabase project, open the **SQL editor** and run, in order:

1. `supabase/schema.sql` — creates the `creators` table
2. `supabase/seed-creators.sql` — adds sample creators (optional)

`supabase/001-make-imageurl-optional.sql` is already folded into `schema.sql`.
It is kept for the history of the change.

**3. Configure**

```bash
cp .env.example .env
```

Fill in both values from **Supabase → Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | The **anon / public** key |

Use the **anon** key, never the `service_role` key. Anything named `VITE_*` is
compiled into the JavaScript the browser downloads, so a `service_role` key
there would be handed to every visitor.

If either variable is missing the app shows a setup screen naming what is absent
instead of failing with a blank page.

**4. Run**

```bash
npm run dev
```

Open http://localhost:5173.

## Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run preview     # serve the production build locally
npm run lint        # ESLint
npm test            # run the tests once
npm run test:watch  # re-run tests as files change
```

## Tests

```bash
npm test
```

18 tests, no network access and no database needed — Supabase is replaced with a
fake, so they run offline in about a second.

- `src/errorMessage.test.js` — the error translator, including that a raw
  `TypeError: Failed to fetch` never reaches the user
- `src/components/CreatorForm.test.jsx` — labels, pre-filling when editing,
  whitespace trimming, saving an empty image as `null` rather than `""`, and
  keeping the user's typing when a save fails
- `src/pages/ShowCreators.test.jsx` — the homepage's loading, list, empty and
  error states, plus singular/plural wording on the count badge

---

## Security notes

- The **anon key is meant to be public.** It is what Supabase issues for
  browser code and it is visible in the built bundle by design.
- **Row-level security is deliberately disabled** on the `creators` table
  (`supabase/schema.sql` says so explicitly). This prework has no user accounts,
  so there is no per-user rule to enforce.
  **The consequence, stated plainly:** anyone with the anon key can read, edit
  and delete every row. That is acceptable for a disposable demo with sample
  data and would not be acceptable for real data. Adding Supabase Auth and
  per-user RLS policies is the first thing a real version needs.
- `.env` is gitignored, and no credential is committed. `.env.example` holds
  placeholders only.

## Known limitations

- **No authentication.** One shared list, and anyone can change it.
- **The hosted demo's database is gone** (see the note at the top). Local setup
  works fully.
- **No pagination.** Every creator is loaded at once. Fine for tens of rows,
  wrong for thousands.
- **No image upload.** Images are external URLs, so a creator's picture breaks if
  the source removes it. There is a fallback placeholder for exactly that.
- **Tests cover the form and the homepage**, not the view/edit/delete pages.

## Future improvements

1. Supabase Auth plus RLS policies so each person keeps their own list.
2. Search and filter by name.
3. Supabase Storage for uploaded images instead of external URLs.
4. Optimistic updates so deleting feels instant.

## Troubleshooting

**"Could not reach the database"**
The Supabase project in `VITE_SUPABASE_URL` is paused, deleted, or the URL is
wrong. Free projects pause after inactivity — open the Supabase dashboard and
resume or recreate it.

**"The 'creators' table was not found"**
`supabase/schema.sql` has not been run against this project yet.

**Blank page with a "Missing Supabase settings" heading**
`.env` is missing or incomplete. Copy `.env.example` and fill both values in.

**Changes to `.env` do nothing**
Vite only reads `.env` at startup. Stop `npm run dev` and start it again.

**Refreshing `/creator/3` 404s on Vercel**
That is what `vercel.json` fixes with an SPA rewrite. Make sure it is deployed.

---

## Required Features

The following **required** functionality is completed:

* [x] **A logical component structure in React is used to create the frontend of the app**
* [x] **At least five content creators are displayed on the homepage of the app**
* [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
* [x] **API calls use the async/await design pattern via Axios or fetch()**
* [x] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**
* [x] **Each content creator has their own unique URL**
* [x] **The user can edit a content creator to change their name, url, or description**
* [x] **The user can delete a content creator**
* [x] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**

The following **optional** features are implemented:

* [ ] Picocss is used to style HTML elements
* [x] The content creator items are displayed in a creative format, like cards instead of a list
* [x] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

* [x] Custom dark navy design system built from scratch with CSS variables, including a gradient hero and hover-lifted cards
* [x] Fully responsive card grid using CSS Grid `auto-fill`, so the layout reflows from three columns to one on mobile
* [x] Dedicated 404 route for any unmatched URL
* [x] Distinct loading, empty, and error states on every page that touches the database
* [x] Inline SVG placeholder rendered automatically when a creator has no image, plus an `onError` fallback for broken image links
* [x] Delete requires a confirmation dialog naming the creator before the row is removed
* [x] Shared `CreatorForm` component powers both the add and edit pages, so validation and layout stay consistent
* [x] Deployed to Vercel with SPA rewrites, so refreshing a details or edit URL loads correctly instead of 404ing
* [x] `supabase/` folder containing the table schema, a migration, and a reusable seed script

## Video Walkthrough

Here's a walkthrough of implemented required features:

[Watch the Creatorverse walkthrough on YouTube](https://youtu.be/GgjnfFbihpE)

## Notes

A challenge was making the `imageurl` field optional. The table was first created with `imageurl text not null`, so adding a creator without an image caused a database error. I created a migration to allow `NULL` image URLs and added a placeholder image for creators without a photo.

Another challenge was deploying React Router to Vercel. Refreshing a creator details URL originally returned a 404. I added a `vercel.json` rewrite so Vercel sends routes back to `index.html`, where React Router can load the correct page.

## License

Copyright 2026 Dhimy Jean

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
