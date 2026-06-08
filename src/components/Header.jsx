import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header({ cartCount, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-top-row">
          <Link
            to="/"
            className="logo-brand-wrap"
            onClick={() => setSearchQuery("")}
            aria-label="Irui Store Home"
          >
            <svg
              className="irui-logo-icon"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6H14L22 26H14L6 6Z" fill="var(--accent)" />
              <path
                d="M18 6H26L21 16H13L18 6Z"
                fill="var(--text-main)"
                opacity="0.85"
              />
              <circle cx="26" cy="26" r="3" fill="var(--accent)" />
            </svg>
            <span className="logo-text">Irui</span>
          </Link>

          <nav className="nav-links">
            <Link
              to="/"
              className="nav-link"
              onClick={() => setSearchQuery("")}
            >
              Catalog
            </Link>
            <Link to="/orders" className="nav-link">
              Orders
            </Link>
            <Link to="/checkout" className="cart-badge-link">
              <span className="cart-label">Cart</span>
              <span className="cart-count-pill">{cartCount}</span>
            </Link>
          </nav>
        </div>

        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search minimal essentials..."
            value={searchQuery}
            onChange={handleInputChange}
            className="header-search-input"
          />
        </div>
      </div>
    </header>
  );
}
