// App.jsx

import { useRoutes } from "react-router-dom";
import Layout from "./components/Layout";
import ShowCreators from "./pages/ShowCreators";
import ViewCreator from "./pages/ViewCreator";
import AddCreator from "./pages/AddCreator";
import EditCreator from "./pages/EditCreator";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

// App maps every URL to the page that should render for it.
export default function App() {
  // useRoutes takes the same information as <Routes>, written as an array.
  // Layout is the parent, so the navbar and footer are written once instead
  // of being repeated inside all five pages.
  const element = useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <ShowCreators /> },
        { path: "/new", element: <AddCreator /> },

        // ":id" is a URL parameter. It gives every creator its own address,
        // like /creator/19, which the page reads back with useParams().
        { path: "/creator/:id", element: <ViewCreator /> },
        { path: "/creator/:id/edit", element: <EditCreator /> },

        // "*" matches anything the routes above did not.
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return element;
}
