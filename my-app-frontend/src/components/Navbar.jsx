import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../AuthContext"; // Import the useAuth hook
import { Dropdown } from "react-bootstrap"; // Import Dropdown from react-bootstrap
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { FaCartShopping } from "react-icons/fa6";

const Navbar = () => {
  const appname = "  MERN ECOMMERCE";
  const state = useSelector((state) => state.handleCart);
  const { isLoggedIn, logout, user } = useAuth(); // Get the isLoggedIn status, logout function, and user object from the auth context

  const handleLogout = () => {
    logout();
    localStorage.clear("uid");
    toastr.success("Logout successful!");
    localStorage.clear("token")
    console.log(user);
  };

  useEffect(() => {
    console.log("Is logged in:", isLoggedIn); // Log the isLoggedIn state for debugging
  }, [isLoggedIn]); // Re-run this effect when isLoggedIn changes

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top"
      style={{ background: "linear-gradient(45deg, #d5ed81, transparent)" }}
    >
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          <FaCartShopping
            style={{
              fontSize: "35px",
              color: "orangered",
              display: "inline-flex",
            }}
          />
          <p
            style={{ display: "contents", color: "darkblue", fontSize: "20px" }}
          >
            {appname}
          </p>
        </NavLink>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="buttons text-center" style={{ display: "contents" }}>
            {isLoggedIn ? (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-dark"
                    id="dropdown-basic"
                    className="d-flex align-items-center"
                  >
                    <i className="fa fa-user-circle mr-2"></i> {user?.email || "User"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {user?.isAdmin && (
                      <Dropdown.Item as={NavLink} to="/admin/dashboard">
                        Admin Dashboard
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline-dark m-2">
                  <i className="fa fa-sign-in-alt mr-1"></i> Login
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-dark m-2">
                  <i className="fa fa-user-plus mr-1"></i> Register
                </NavLink>
                <NavLink to="/login-admin" className="btn btn-outline-dark m-2">
                  <i className="fa fa-user-shield mr-1"></i> Admin Login
                </NavLink>
              </>
            )}

            <NavLink to={`/cart?userId=${user?._id}`} className="btn btn-outline-dark m-2">
              <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
