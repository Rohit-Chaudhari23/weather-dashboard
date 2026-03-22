import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">🌤 Weather App</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/history">History</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>

        <footer className="footer">© 2026 Weather Dashboard</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;