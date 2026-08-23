// App.jsx - Connects each URL to the page that should render for it.
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import ShowCreators from "./pages/ShowCreators.jsx";
import ViewCreator from "./pages/ViewCreator.jsx";
import AddCreator from "./pages/AddCreator.jsx";
import EditCreator from "./pages/EditCreator.jsx";
import NotFound from "./pages/NotFound.jsx";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Every page renders inside Layout, so the navbar and footer are
          written once instead of being repeated on each page. */}
      <Route element={<Layout />}>
        <Route path="/" element={<ShowCreators />} />
        <Route path="/new" element={<AddCreator />} />

        {/* :id is a URL parameter. It gives every creator its own address,
            like /creator/19, which the page reads with useParams(). */}
        <Route path="/creator/:id" element={<ViewCreator />} />
        <Route path="/creator/:id/edit" element={<EditCreator />} />

        {/* "*" matches anything the routes above did not. */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
