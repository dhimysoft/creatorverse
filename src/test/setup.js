// Runs before every test file.
// Adds the extra matchers from jest-dom, so tests can say things like
// expect(element).toBeInTheDocument() instead of checking for null by hand.
import "@testing-library/jest-dom/vitest";
