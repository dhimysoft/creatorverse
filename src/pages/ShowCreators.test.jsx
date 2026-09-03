// Tests for the homepage's four states: loading, error, empty, and list.
//
// Supabase is replaced with a fake so these run offline and instantly. What is
// being tested is OUR logic — which state renders when — not Supabase itself.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// The mock has to be declared before the component is imported, because the
// component imports supabase at module load.
vi.mock("../client", () => ({
  supabase: { from: vi.fn() },
}));

import { supabase } from "../client";
import ShowCreators from "./ShowCreators";

// Build the fake query chain: supabase.from(...).select(...).order(...)
// The final .order() call is what resolves, so that is where the result goes.
function mockQueryResult(result) {
  supabase.from.mockReturnValue({
    select: () => ({
      order: () => Promise.resolve(result),
    }),
  });
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ShowCreators />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ShowCreators", () => {
  it("shows placeholder cards while the data is still loading", () => {
    // A promise that never settles keeps the page in its loading state.
    supabase.from.mockReturnValue({
      select: () => ({ order: () => new Promise(() => {}) }),
    });

    const { container } = renderPage();

    expect(container.querySelectorAll(".creator-card-skeleton").length).toBe(3);
  });

  it("lists the creators that come back", async () => {
    mockQueryResult({
      data: [
        { id: 1, name: "Fireship", url: "https://example.com/1", description: "Fast videos" },
        { id: 2, name: "Theo", url: "https://example.com/2", description: "Opinions" },
      ],
      error: null,
    });

    renderPage();

    expect(await screen.findByText("Fireship")).toBeInTheDocument();
    expect(screen.getByText("Theo")).toBeInTheDocument();

    // The count badge must agree with what is on screen.
    expect(screen.getByText("2 creators")).toBeInTheDocument();
  });

  it('uses the singular "creator" when there is exactly one', async () => {
    mockQueryResult({
      data: [{ id: 1, name: "Fireship", url: "https://example.com/1", description: "Fast videos" }],
      error: null,
    });

    renderPage();

    expect(await screen.findByText("1 creator")).toBeInTheDocument();
  });

  it("invites you to add one when the list is empty", async () => {
    mockQueryResult({ data: [], error: null });

    renderPage();

    expect(await screen.findByText(/no creators yet/i)).toBeInTheDocument();
  });

  // Supabase returns data: null on some failures. Rendering must not crash.
  it("treats a null result as empty rather than crashing", async () => {
    mockQueryResult({ data: null, error: null });

    renderPage();

    expect(await screen.findByText(/no creators yet/i)).toBeInTheDocument();
  });

  it("shows a readable error, not the raw browser message", async () => {
    mockQueryResult({ data: null, error: new TypeError("Failed to fetch") });

    renderPage();

    expect(await screen.findByText(/could not reach the database/i)).toBeInTheDocument();
    expect(screen.queryByText(/TypeError/)).not.toBeInTheDocument();

    // The count badge must be hidden while an error is showing — otherwise the
    // page would claim "0 creators" when it simply failed to load them.
    expect(document.querySelector(".badge")).toBeNull();
  });
});
