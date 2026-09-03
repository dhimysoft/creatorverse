# Interview Guide — Creatorverse

Based only on what is in this repository.

> **Say what it is.** Creatorverse started as the **CodePath WEB103 prework**
> assignment. Do not present it as an original product idea — the brief was
> given. What *is* yours is all the code, the design system, and everything in
> the "additional features" list. Interviewers respect "this was an assignment
> and here's how I went past the brief" far more than a vague claim.

---

## 30-second explanation

> "Creatorverse is a React app for keeping a list of content creators worth
> following. It's full CRUD against a Supabase Postgres database — browse, view,
> add, edit, delete. It started as a CodePath assignment, but I went a fair bit
> past the brief: I wrote my own dark design system instead of using a CSS
> framework, and every page that touches the database has proper loading, empty,
> and error states rather than just rendering nothing while it waits."

## 60–90-second explanation

> "It's a CRUD app on React, Vite and Supabase. Supabase gives you hosted
> Postgres with a REST API, so there's no backend of my own — the React app talks
> straight to the database with the anon key.
>
> Five routes: a card grid homepage, a details page per creator, add, edit, and a
> 404. Add and Edit share one `CreatorForm` component, so validation and layout
> can't drift apart between them.
>
> The part I'd point at is state handling. Every page that fetches has four
> distinct states — loading, error, empty, and has-data — and they're all
> rendered explicitly. There's a skeleton card while it loads, a real message if
> the fetch fails, and an invitation to add the first creator if the list is
> empty. That's the difference between a demo and something that doesn't look
> broken the moment anything goes wrong.
>
> I also added a small module that translates errors. Supabase surfaces a dead
> project as `TypeError: Failed to fetch`, which tells a user nothing, so I map
> the failures that actually happen onto sentences that say what to do."

---

## Verified architecture and data flow

```
React (Vite) ──supabase-js──> Supabase REST API ──> PostgreSQL
                                                    └── creators table
```

**"Add a creator", end to end:**

1. `AddCreator.jsx` renders `CreatorForm`.
2. On submit, the form trims every field and turns an empty image URL into
   `null` (the column is nullable; `""` would store an empty string and render a
   broken image).
3. It calls the `onSubmit` prop, which `AddCreator` implements as
   `supabase.from("creators").insert(...)`.
4. supabase-js sends an HTTP POST to Supabase's REST API with the anon key.
5. PostgREST inserts the row and returns it.
6. On success the page navigates home; on failure `describeError` converts the
   error and the form shows it **without clearing what was typed**.

## Files worth being able to open

| File | Why |
|---|---|
| `src/pages/ShowCreators.jsx` | The four render states, explicitly handled. |
| `src/components/CreatorForm.jsx` | One form serving both Add and Edit. |
| `src/errorMessage.js` | Small, self-contained, and easy to justify. |
| `src/client.js` | Nine lines. Shows you know config belongs in one place. |
| `supabase/schema.sql` | Real SQL, including the RLS decision. |
| `src/pages/ShowCreators.test.jsx` | How the states are tested without a network. |

---

## Three engineering decisions

**1. No state management library.**
Five pages, one table. Each page fetches what it needs and owns its own loading
and error state. Redux or Zustand would add a store, actions and boilerplate to
solve a problem this app does not have. If creators had to be shared across many
components and mutated from several places, that would change.

**2. One shared `CreatorForm` for Add and Edit.**
The two pages differ only in what they start with and what they do on submit, so
the form takes `initialValues` and an `onSubmit` prop. Two separate forms would
have meant fixing every validation bug twice — which is the actual reason to
share a component, not "reuse" in the abstract.

**3. An error-translation module instead of showing raw errors.**
`setError(error.message)` is the easy version, and it puts
`TypeError: Failed to fetch` in front of a user. `describeError` maps the cases
that actually occur — unreachable project, missing table, RLS refusal — onto
plain sentences, and passes anything unrecognised straight through so no
information is ever swallowed.

---

## Three challenges

**1. `imageurl` was `NOT NULL`, so creators without a photo failed to save.**
The table was created with `imageurl text not null`. Rather than making the
field required in the UI, I wrote a migration
(`supabase/001-make-imageurl-optional.sql`) to allow `NULL`, converted existing
empty strings to `NULL`, and added an inline SVG placeholder plus an `onError`
fallback for broken links. **This is a good story** — it is a schema change
driven by a real product requirement.

**2. Refreshing a details URL 404'd on Vercel.**
React Router handles routes in the browser, but a refresh asks the *server* for
`/creator/3`, which does not exist as a file. Fixed with an SPA rewrite in
`vercel.json` so every path returns `index.html` and the router takes over.
Classic single-page-app deployment problem — good to be able to explain.

**3. Keyboard focus was invisible.**
The form inputs had a custom blue glow, but it was written as
`.field input:focus { outline: none; ... }` — and links and buttons had nothing
at all. Adding a plain `input:focus-visible` rule did nothing, because the
existing `.field input:focus` selector is more specific and won. The fix was
writing the focus-visible rule at matching specificity. **A neat, honest
specificity story** — and `:focus-visible` rather than `:focus` means the ring
appears for keyboard users without flashing on every mouse click.

---

## Testing strategy

18 tests with Vitest and React Testing Library. Supabase is replaced with a fake,
so they need no network and no database and finish in about a second.

The choice worth explaining: **the tests assert what the user sees, not how the
component is built.** They query by label text and visible text, so renaming a
state variable does not break them, but removing the empty state does. Tests
that assert on internals pass while the app is broken, which is worse than none.

Highest-value tests:
- A raw `TypeError: Failed to fetch` never reaches the screen.
- An empty image field saves as `null`, not `""`.
- Your typing survives a failed save.
- `data: null` from Supabase renders the empty state instead of crashing.

Not tested: the View, Edit and Delete pages. Say so if asked.

---

## Security considerations

- The **anon key is designed to be public** — it is what Supabase issues for
  browser code. The `service_role` key never goes near a `VITE_*` variable,
  because those are compiled into the bundle every visitor downloads.
- **Row-level security is off, deliberately and in writing** in
  `supabase/schema.sql`. With no user accounts there is no per-user rule to
  enforce. The honest consequence: anyone with the anon key can change any row.
  Fine for a demo with disposable sample data; not fine for real data.
- `.env` is gitignored; `.env.example` holds placeholders only.

**If an interviewer challenges the RLS decision, agree with them.** The right
answer is: "You're right that it's wide open. It's a no-auth prework demo so
there's no rule to write, but the first thing a real version needs is Supabase
Auth plus a policy tying each row to `auth.uid()`." Knowing the limitation is the
point.

---

## One honest limitation

**There is no authentication, so the list is shared and anyone can delete
anything.** It is a single-user tool pretending to be a website. Adding Supabase
Auth with per-user RLS is the obvious next step and the reason RLS exists.

## Sensible next step

Supabase Auth plus row-level security policies. It is the smallest change that
turns this from a demo into something usable by more than one person, and it
directly addresses the limitation above.

---

## Ten likely questions

**1. Why Supabase instead of writing your own Express backend?**
The app is one table and plain CRUD. Supabase gives hosted Postgres and a REST
API over it, so an Express layer would only forward requests. If I needed
business logic, third-party API keys that must stay secret, or work the client
should not be trusted with, I would add a backend.

**2. Is it safe to put the Supabase key in frontend code?**
The anon key, yes — it is meant for browsers and it is what row-level security is
designed to work with. The `service_role` key, never; it bypasses every rule.

**3. So what actually protects your data?**
Right now, nothing — RLS is off because there are no accounts. That is a
deliberate, documented choice for a prework demo, and the first thing I would
change.

**4. Why no Redux?**
Nothing needs sharing. Five pages, each fetching its own data. A store would be
indirection with no payoff.

**5. How do you handle a request that fails?**
Every fetching page has an explicit error state, and `describeError` turns the
raw error into a sentence a person can act on. A failed save keeps the user's
input rather than clearing the form.

**6. What is the difference between `:focus` and `:focus-visible`?**
`:focus` matches however focus arrived, including a mouse click, so a ring
flashes on every click. `:focus-visible` only matches when the browser judges a
visible indicator is warranted — essentially keyboard navigation.

**7. Why is `imageurl` nullable when the others aren't?**
Name, URL and description are what make a creator entry meaningful. A photo is
decoration, so it is optional — and the empty case renders a placeholder.

**8. What happens if two people edit the same creator?**
Last write wins; there is no conflict handling. With no accounts and a small
shared list it has not mattered, but I would need optimistic concurrency — a
version column or an `updated_at` check — before it did.

**9. Why did refreshing a details page break in production but not locally?**
Vite's dev server falls back to `index.html` for unknown paths automatically.
Vercel serves static files, so it looked for a real `/creator/3` and 404'd. The
`vercel.json` rewrite restores the fallback.

**10. What would you do first if this had 10,000 creators?**
Paginate. `ShowCreators` currently fetches every row, which is fine for tens and
wrong for thousands. Supabase supports `.range()`, so it would be pagination or
infinite scroll, plus a search box so people are not scrolling to find someone.

---

## Five-minute demo script

**Set up before you share your screen:** Supabase project resumed, `npm run dev`
running, seed data loaded. The hosted link's database is gone — demo locally.

1. **(30s)** "A CRUD app for curating creators. CodePath prework, extended past
   the brief."
2. **(45s) Homepage.** Card grid, count badge. Resize the window and let the grid
   reflow to one column — it is CSS Grid `auto-fill`, no media query.
3. **(45s) Details page.** Point out the URL — each creator has their own.
4. **(60s) Add a creator.** Fill it in and save. Then mention the image field is
   optional and show the placeholder on a creator without a photo.
5. **(45s) Delete.** Show the confirmation dialog naming the creator. "Destructive
   actions should be hard to do by accident."
6. **(45s) Error handling.** *This is the memorable bit.* Stop the Supabase
   project or go offline and reload — the app shows a readable message telling
   you what to check, not `TypeError: Failed to fetch`.
7. **(30s) Tests.** `npm test` — 18 passing, no network needed.

## Likely follow-ups

- *"Show me where the four states are handled."* → `ShowCreators.jsx`, the
  conditional blocks after `<div className="section-heading">`.
- *"What happens if Supabase returns `data: null`?"* → Treated as empty via
  `data ?? []`. There is a test for it.
- *"Your `describeError` uses regexes on error text. Isn't that brittle?"* →
  Yes, and that is the honest answer. It matches on `code` where Supabase
  provides one (`42P01`, `42501`) and only falls back to text matching for
  browser network errors, which have no code. Anything unmatched passes through
  unchanged, so a wording change degrades to the old behaviour rather than
  hiding the error.
- *"Why is the client created at module scope?"* → One connection reused across
  the app. Creating it per component would rebuild it on every render.
