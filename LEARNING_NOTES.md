# Learning Notes — Creatorverse

What changed and why. Written for you, not for a recruiter.

---

## 1. `.env.example` was missing

### What was wrong

`.env` is gitignored (correctly — it holds your Supabase key). But there was no
`.env.example`, so anyone cloning the repo got a "Missing Supabase settings"
screen with no way to know what the variable names were or where to get them.

### Why the new solution works

`.env.example` is committed and lists both variables with placeholder values and
a comment saying exactly where in the Supabase dashboard to find them. It also
warns not to use the `service_role` key.

### The idea worth remembering

**`.env` is secret; `.env.example` is documentation.** Every project with a
`.env` should have an `.env.example` beside it, holding the same keys with fake
values. It is the difference between a repo someone can run and one they cannot.

---

## 2. Users saw `TypeError: Failed to fetch`

### What was wrong

Every page did this:

```js
setError(fetchError.message);
```

When a Supabase project is paused or deleted, the browser cannot resolve its
hostname and `fetch` rejects with `TypeError: Failed to fetch`. So the page said:

> Could not load creators: TypeError: Failed to fetch

That helps nobody. **This is not hypothetical — it is exactly what your app does
right now**, because the Supabase project behind it no longer resolves.

### Why the new solution works

`src/errorMessage.js` maps the failures that actually occur onto sentences:

| Situation | What the user now sees |
|---|---|
| Project unreachable | "Could not reach the database… check that the Supabase project in `VITE_SUPABASE_URL` still exists — free projects are paused after inactivity." |
| Table missing (`42P01`) | "Run `supabase/schema.sql` in your SQL editor." |
| Blocked by RLS (`42501`) | "The database rejected that request because of its security rules." |
| Anything else | The original message, unchanged. |

That last row matters: an unknown error is **passed through**, never swallowed.

### The idea worth remembering

**Translate errors at the boundary, once.** One module that every page imports,
rather than a `try/catch` in each page growing its own special cases. And always
keep a fallback that shows the original message — a translator that hides
unexpected errors is worse than no translator.

---

## 3. Keyboard users could not see where they were

### What was wrong

There were no `:focus` styles on links or buttons at all. Inputs had one:

```css
.field input:focus,
.field textarea:focus {
  outline: none;                                   /* ← removes the default ring */
  border-color: var(--blue-400);
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.2);   /* ← replaces it, only for inputs */
}
```

So inputs were fine, but tabbing to "Add a creator" or "Delete" showed nothing.

### The interesting part: the first fix silently failed

Adding this did **nothing**:

```css
input:focus-visible { outline: 3px solid var(--cyan-300); }
```

Because `.field input:focus` is **more specific** — a class plus an element plus
a pseudo-class beats an element plus a pseudo-class. CSS resolves conflicts by
specificity first and source order only as a tiebreak, so being later in the file
did not help.

I only caught it by checking the computed style in the browser:

```js
getComputedStyle(input).outlineStyle   // "none" — the rule was losing
```

### Why the new solution works

The rule is written at matching specificity, listing `.field input:focus-visible`
explicitly alongside the bare `a`, `button` and `select` selectors. Verified
afterwards: all three now report `outlineStyle: "solid"` in cyan.

`:focus-visible` rather than `:focus` means the ring shows for keyboard
navigation but not on every mouse click.

### The idea worth remembering

**When a CSS rule "doesn't work", check specificity before rewriting it**, and
confirm with `getComputedStyle` rather than squinting at a screenshot. Also:
`outline: none` without a replacement is one of the most common accessibility
bugs on the web.

---

## 4. No tests existed

### What was wrong

Nothing verified any behaviour. The risk with a CRUD app is quiet data bugs — an
empty image saving as `""` instead of `null`, or a failed save wiping the form.

### Why the new solution works

18 tests with Vitest and React Testing Library. Supabase is replaced with a fake,
so they need no network and run in about a second:

```js
vi.mock("../client", () => ({ supabase: { from: vi.fn() } }));
```

The mock is declared **before** the component is imported, because the component
imports `supabase` at module load — declaring it after would be too late.

To hold the page in its loading state, the fake returns a promise that never
settles:

```js
order: () => new Promise(() => {})
```

### The idea worth remembering

**Test what the user sees, not how the component works.** These query by label
text and visible text, so renaming a state variable does not break them — but
deleting the empty state does. A test that asserts on internals can pass while
the app is visibly broken.

---

## 5. Motion was not optional

`prefers-reduced-motion` is a system setting on macOS and Windows for people who
get motion sickness or migraines from on-screen movement. The card hover lift and
the skeleton pulse are decorative, so a media query now reduces every animation
and transition to near-zero when that setting is on. Nothing becomes unusable —
only the movement stops.

---

## Concepts to study

1. **CSS specificity** — why `.field input:focus` beats `input:focus-visible`.
2. **`:focus` vs `:focus-visible`** — and why `outline: none` alone is a bug.
3. **The anon key vs the service_role key** — and why `VITE_*` is public.
4. **Row-level security** — the mechanism that makes a public anon key safe.
5. **Module mocking in Vitest** — and why mock declarations must come first.
6. **SPA rewrites** — why refreshing a client-side route 404s on a static host.
7. **`??` vs `||`** — `data ?? []` keeps `0` and `""`; `data || []` would not.

## Files to read

1. `src/client.js` — nine lines, the whole database connection.
2. `src/errorMessage.js` — small and self-contained.
3. `src/pages/ShowCreators.jsx` — the four states in one component.
4. `src/components/CreatorForm.jsx` — one form, two pages.
5. `src/pages/ShowCreators.test.jsx` — how to test a component that fetches.

## Commands to remember

```bash
npm run dev     # development server
npm test        # 18 tests, offline
npm run lint    # ESLint
npm run build   # production build
```

---

## Five practice questions

**1. Why did adding `input:focus-visible { outline: ... }` have no effect?**

`.field input:focus` is more specific (class + element + pseudo-class beats
element + pseudo-class). CSS applies specificity before source order, so being
later in the file did not matter. The fix was matching the specificity.

**2. Why must `vi.mock("../client")` appear before `import ShowCreators`?**

The component reads `supabase` when its module is first loaded. If the mock is
registered after that, the real client is already in place.

**3. What is wrong with `setError(error.message)`?**

For a network failure that message is `TypeError: Failed to fetch`, which tells
the user nothing actionable. `describeError` maps known failures onto plain
sentences and passes unknown ones through unchanged.

**4. Why is it safe to ship `VITE_SUPABASE_ANON_KEY` in the bundle, but never
`service_role`?**

The anon key is designed for browsers and is constrained by row-level security.
`service_role` bypasses every policy, so publishing it hands anyone full database
access. Anything named `VITE_*` is compiled into the downloadable bundle.

**5. Why does the form send `null` instead of `""` for an empty image URL?**

`imageurl` is nullable, and `NULL` means "no image" — which is what the
placeholder logic checks for. An empty string is a *value*, so the card would try
to render an image with `src=""` and show a broken image.
