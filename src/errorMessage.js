// Turns a raw Supabase or network error into something a person can act on.
//
// Supabase surfaces failures in two very different shapes:
//
//   1. The request never left the browser — no internet, or the project URL no
//      longer resolves because the Supabase project was paused or deleted.
//      fetch() rejects with the unhelpful "TypeError: Failed to fetch".
//   2. The request arrived and PostgREST refused it — a missing table, a broken
//      column, a row-level-security policy. Those come back with a real message
//      and usually a `code`.
//
// Showing "TypeError: Failed to fetch" to a user tells them nothing and, worse,
// tells the developer nothing either. This maps the cases we actually hit onto
// plain sentences, and falls back to the original message for anything else so
// no information is ever swallowed.

export function describeError(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  const message = typeof error === "string" ? error : error.message || "";

  // Case 1: the browser could not reach Supabase at all.
  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return (
      "Could not reach the database. Check your internet connection, and " +
      "check that the Supabase project in VITE_SUPABASE_URL still exists — " +
      "free projects are paused after a period of inactivity."
    );
  }

  // Case 2: the table is missing, which almost always means the SQL in
  // supabase/schema.sql has not been run against this project yet.
  if (error.code === "42P01" || /relation .* does not exist/i.test(message)) {
    return (
      "The 'creators' table was not found. Run supabase/schema.sql in your " +
      "Supabase project's SQL editor, then reload."
    );
  }

  // Case 3: blocked by row-level security.
  if (error.code === "42501" || /row-level security/i.test(message)) {
    return (
      "The database rejected that request because of its security rules. " +
      "Check the row-level security settings on the 'creators' table."
    );
  }

  return message || "Something went wrong. Please try again.";
}
