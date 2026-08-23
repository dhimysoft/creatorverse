// Starts the app and turns on routing.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Without the Supabase keys the app cannot connect, so show what is missing
// instead of a blank white page.
const missing = [
  ["VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL],
  ["VITE_SUPABASE_ANON_KEY", import.meta.env.VITE_SUPABASE_ANON_KEY],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

const root = createRoot(document.getElementById("root"));

if (missing.length > 0) {
  root.render(
    <div className="page page-narrow">
      <h1>Missing Supabase settings</h1>

      <p>This app cannot start until these are set in a .env file:</p>

      <ul>
        {missing.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>

      <p>
        Add them to <code>.env</code> in the project root, then restart{" "}
        <code>npm run dev</code>.
      </p>
    </div>,
  );
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
