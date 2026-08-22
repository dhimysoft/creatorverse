import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import ShowCreators from './pages/ShowCreators'
import ViewCreator from './pages/ViewCreator'
import AddCreator from './pages/AddCreator'
import EditCreator from './pages/EditCreator'
import NotFound from './pages/NotFound'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link className="navbar__brand" to="/">
            <span className="navbar__mark">✦</span> Creatorverse
          </Link>
          <div className="navbar__links">
            <Link to="/">All creators</Link>
            <Link className="btn btn--primary btn--sm" to="/new">
              Add a creator
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ShowCreators />} />
          <Route path="/new" element={<AddCreator />} />
          <Route path="/creator/:id" element={<ViewCreator />} />
          <Route path="/creator/:id/edit" element={<EditCreator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="footer">
          <p>Creatorverse · CodePath WEB103 Prework</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}
