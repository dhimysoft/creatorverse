// Sets up every route in the app.

import { useRoutes } from "react-router-dom";
import Layout from "./components/Layout";
import ShowCreators from "./pages/ShowCreators";
import ViewCreator from "./pages/ViewCreator";
import AddCreator from "./pages/AddCreator";
import EditCreator from "./pages/EditCreator";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

export default function App() {
  // Step 3: useRoutes holds all the routes. Layout is the parent, so the
  // navbar and footer are only written once.
  const element = useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <ShowCreators /> },
        { path: "/new", element: <AddCreator /> },

        // The :id gives every creator its own URL, like /creator/19.
        { path: "/creator/:id", element: <ViewCreator /> },
        { path: "/creator/:id/edit", element: <EditCreator /> },

        // Anything that does not match the routes above shows the 404 page.
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return element;
}
