import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css"; // Optional: for custom styling
import axios from "axios"; // Import Axios if needed for direct API calls

const AdminNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("admintoken"); // Check if admin is logged in

  const handleLogout = () => {
    localStorage.removeItem("admintoken"); // Remove admin token
    navigate("/login-admin"); // Redirect to admin login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          MyApp Admin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-light fw-bold" to="/">
                Home
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-bold"
                    to="/admin/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-bold"
                    to="/productcrud"
                  >
                    Product CRUD
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-bold"
                    to="/admin/messages"
                  >
                    Messages
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-light text-primary fw-bold ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link text-light fw-bold"
                  to="/login-admin"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
