import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toastr.error("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });
      setSuccess("User registered successfully");
      setError("");
      toastr.success("User registered successfully");
      console.log("Registration response:", res.data); // Add this line for debugging
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError("Error registering user");
      setSuccess("");
      toastr.error("Error registering user");
      console.error("Registration error:", err.response.data); // Add this line for debugging
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="container my-3 py-3"
        style={{ background: "linear-gradient(45deg, #3045d1, transparent)" }}
      >
        <h1 className="text-center" style={{ color: "darkblue" }}>
          Register
        </h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleRegister}>
              <div className="my-3">
                <label htmlFor="floatingInput">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="my-3">
                <label htmlFor="floatingPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="my-3">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <div className="my-3">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-underline text-info"
                  >
                    Login
                  </Link>{" "}
                </p>
              </div>
              <div className="text-center">
                <button
                  className="my-2 mx-auto btn btn-dark"
                  type="submit"
                  style={{
                    width: "100%",
                    background: " linear-gradient(45deg, #93ed0e, transparent)",
                  }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
