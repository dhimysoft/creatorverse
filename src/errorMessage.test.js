// Tests for the error translator.
//
// This is pure logic with no React and no network, so it is the cheapest thing
// in the project to test and the easiest to get wrong.

import { describe, it, expect } from "vitest";

import { describeError } from "./errorMessage";

describe("describeError", () => {
  it("explains an unreachable database instead of showing 'Failed to fetch'", () => {
    const result = describeError(new TypeError("Failed to fetch"));

    expect(result).toMatch(/could not reach the database/i);
    expect(result).toMatch(/VITE_SUPABASE_URL/);
    // The raw browser wording must not survive into the UI.
    expect(result).not.toMatch(/TypeError/);
  });

  it("recognises the other wording browsers use for the same failure", () => {
    expect(describeError(new Error("NetworkError when attempting to fetch"))).toMatch(
      /could not reach the database/i,
    );
    expect(describeError(new Error("Load failed"))).toMatch(
      /could not reach the database/i,
    );
  });

  it("tells you to run the schema when the table is missing", () => {
    const missingTable = { code: "42P01", message: 'relation "creators" does not exist' };

    expect(describeError(missingTable)).toMatch(/schema\.sql/);
  });

  it("names row-level security when that is what blocked the request", () => {
    expect(describeError({ code: "42501", message: "new row violates row-level security policy" }))
      .toMatch(/security rules/i);
  });

  it("passes through a message it does not recognise rather than hiding it", () => {
    expect(describeError(new Error("duplicate key value violates unique constraint")))
      .toBe("duplicate key value violates unique constraint");
  });

  it("never returns an empty string", () => {
    expect(describeError(null)).toBeTruthy();
    expect(describeError(undefined)).toBeTruthy();
    expect(describeError({})).toBeTruthy();
    expect(describeError(new Error(""))).toBeTruthy();
  });

  it("accepts a plain string", () => {
    expect(describeError("something specific went wrong")).toBe(
      "something specific went wrong",
    );
  });
});
