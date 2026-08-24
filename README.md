# WEB103 Prework - *Creatorverse*

Submitted by: **Dhimy Jean**

About this web app: **Creatorverse is a full CRUD React app for curating content creators worth following. Creators are stored in a Supabase Postgres database and shown in a responsive card grid. Users can view, add, edit, and delete creators.**

GitHub repository: https://github.com/dhimysoft/creatorverse
Live app: https://creatorverse-gilt.vercel.app/

Time spent: **12** hours

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
