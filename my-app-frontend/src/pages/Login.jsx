import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const { token, uid} = res.data;
      const userData = { uid, email, token }; // Create a user object
      localStorage.setItem("token", token);
      localStorage.setItem("uid",uid)
      login(userData); // Update the context
      toastr.success("Login successful!");
      navigate("/"); // Redirect to home page
    } catch (err) {
      setError("Invalid login credentials");
      toastr.error("Invalid login credentials");
    }
  };
  
  return (
    <>
      <Navbar /> {/* Assuming you have a Navbar component */}
      <div
        className="container my-3 py-3"
        style={{ background: "linear-gradient(45deg, #dcf500, transparent)" }}
      >
        <h1 className="text-center" style={{ color: "darkblue" }}>
          Login
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleLogin}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-underline text-info"
                  >
                    Register
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button
                  className="my-2 mx-auto btn btn-dark"
                  type="submit"
                  style={{
                    width: "100%",
                    background: "linear-gradient(45deg, #cd41b2, transparent)",
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer /> {/* Assuming you have a Footer component */}
    </>
  );
};

export default Login;
