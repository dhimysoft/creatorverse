# WEB103 Prework - *Creatorverse*

Submitted by: **Dhimy Jean**

About this web app: **Creatorverse is a full CRUD React app for curating the content creators worth following. Creators are stored in a Supabase Postgres database and rendered as a responsive card grid. You can browse every creator, open a details page at its own unique URL, visit the creator's real channel, and add, edit, or delete entries — all backed by async/await calls to Supabase.**

Time spent: **12** hours

## Required Features

The following **required** functionality is completed:

- [x] **A logical component structure in React is used to create the frontend of the app**
- [x] **At least five content creators are displayed on the homepage of the app**
- [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
- [x] **API calls use the async/await design pattern via Axios or fetch()**
- [x] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**
- [x] **Each content creator has their own unique URL**
- [x] **The user can edit a content creator to change their name, url, or description**
- [x] **The user can delete a content creator**
- [x] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**

The following **optional** features are implemented:

- [ ] Picocss is used to style HTML elements
- [x] The content creator items are displayed in a creative format, like cards instead of a list
- [x] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

* [x] Custom dark navy design system built from scratch with CSS variables instead of Picocss, including a gradient hero and hover-lifted cards
* [x] Fully responsive card grid using CSS Grid `auto-fill`, so the layout reflows from three columns to one on mobile
* [x] Dedicated 404 route for any unmatched URL
* [x] Distinct loading, empty, and error states on every page that touches the database
* [x] Inline SVG placeholder rendered automatically when a creator has no image, and an `onError` fallback for broken image links
* [x] Delete requires a confirmation dialog naming the creator before the row is removed
* [x] Shared `CreatorForm` component powers both the add and edit pages, so validation and layout stay consistent
* [x] Deployed to Vercel with SPA rewrites, so refreshing a details or edit URL loads correctly instead of 404ing
* [x] `supabase/` folder containing the table schema, a migration, and a reusable seed script

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with [LiceCap](https://www.cockos.com/licecap/).

## Notes

Three things took the most time to get right:

**The `imageurl` column fought the spec.** The prework treats `imageURL` as optional, but the table was originally created with `imageurl text not null`. Submitting the add form with the image field blank failed with `null value in column "imageurl" violates not-null constraint`. Rather than silently writing empty strings, I wrote a migration (`supabase/001-make-imageurl-optional.sql`) to drop the constraint so a missing image is genuinely `NULL`, and the card component renders a placeholder for it.

**Column casing matters.** The database column is lowercase `imageurl`, not `imageURL`. Postgres folds unquoted identifiers to lowercase, so the React code has to use `imageurl` everywhere or the value comes back `undefined` with no error to explain why.

**Client-side routing breaks on a static host by default.** Deploying to Vercel meant `/creator/3` returned a 404 on refresh, because the host looked for a real file at that path. A `vercel.json` rewrite sending every request to `index.html` hands routing back to React Router and fixes deep links.

## License

Copyright 2026 Dhimy Jean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
