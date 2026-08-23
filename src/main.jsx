// main.jsx - Starts the React app and puts the router around it.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));

// Vite only exposes variables that start with VITE_, and it reads them from
// .env at build time. If either one is missing the Supabase client cannot be
// created, so show a fixable message instead of a blank white screen.
const missing = [
  ["VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL],
  ["VITE_SUPABASE_ANON_KEY", import.meta.env.VITE_SUPABASE_ANON_KEY],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  root.render(
    <div className="page page-narrow">
      <h1>Missing Supabase settings</h1>

      <p>This app can't start until these are set in a .env file:</p>

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
