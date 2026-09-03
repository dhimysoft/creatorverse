// Tests for the shared Add/Edit form.
//
// The form is the only place a user types data into this app, so this is where
// a mistake would be most visible.

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import CreatorForm from "./CreatorForm";

// The form renders a <Link>, which needs a router around it.
function renderForm(props = {}) {
  return render(
    <MemoryRouter>
      <CreatorForm submitLabel="Save" onSubmit={vi.fn()} {...props} />
    </MemoryRouter>,
  );
}

describe("CreatorForm", () => {
  it("labels every field so screen readers and clicks both work", () => {
    renderForm();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/channel or page url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("starts empty when adding, and pre-filled when editing", () => {
    const { unmount } = renderForm();
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    unmount();

    renderForm({
      initialValues: {
        name: "Fireship",
        url: "https://youtube.com/@fireship",
        description: "Fast web dev videos",
        imageurl: "",
      },
    });

    expect(screen.getByLabelText(/name/i)).toHaveValue("Fireship");
  });

  it("trims whitespace before saving", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderForm({ onSubmit });

    await userEvent.type(screen.getByLabelText(/name/i), "  Fireship  ");
    await userEvent.type(screen.getByLabelText(/channel or page url/i), "  https://example.com  ");
    await userEvent.type(screen.getByLabelText(/description/i), "  Great videos  ");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());

    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: "Fireship",
      url: "https://example.com",
      description: "Great videos",
    });
  });

  // The image column is nullable. Sending "" instead of null would store an
  // empty string, and the card would then try to render a broken image.
  it("saves an empty image field as null, not an empty string", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderForm({ onSubmit });

    await userEvent.type(screen.getByLabelText(/name/i), "Fireship");
    await userEvent.type(screen.getByLabelText(/channel or page url/i), "https://example.com");
    await userEvent.type(screen.getByLabelText(/description/i), "Great videos");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0].imageurl).toBeNull();
  });

  it("shows a readable message and keeps what you typed when saving fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    renderForm({ onSubmit });

    await userEvent.type(screen.getByLabelText(/name/i), "Fireship");
    await userEvent.type(screen.getByLabelText(/channel or page url/i), "https://example.com");
    await userEvent.type(screen.getByLabelText(/description/i), "Great videos");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/could not reach the database/i)).toBeInTheDocument();

    // The user must not lose their work because the network failed.
    expect(screen.getByLabelText(/name/i)).toHaveValue("Fireship");
  });
});
