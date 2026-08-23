// main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Vite only exposes variables that start with VITE_, and it reads them from
// .env at build time. Missing either one means createClient() cannot be built,
// so say which one is missing instead of rendering a blank white page.
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
  // Start the React app.
  root.render(
    <StrictMode>
      {/* Enable routing in the app. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
