import React, { useState } from "react";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useNavigate, Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/admin/login", {
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("admintoken", response.data.token); // Save token in localStorage
        toastr.success("Login successful!");
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      }
    } catch (error) {
      toastr.error(error.response?.data?.error || "Login failed");
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="login-container">
        <div className="login-box">
          <h2 className="text-center">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <Link
              to="/admin/register"
              className="text-decoration-underline text-info"
            >
              Register
            </Link>
          </p>
          {message && <p className="alert alert-danger mt-3">{message}</p>}
        </div>
      </div>

      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
          }

          .login-box {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
          }

          h2 {
            color: #333;
            margin-bottom: 20px;
          }

          .form-label {
            font-weight: 500;
            color: #555;
          }

          .form-control {
            border-radius: 5px;
            border: 1px solid #ddd;
            padding: 10px;
          }

          .form-control:focus {
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 16px;
            transition: background-color 0.3s;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          p {
            color: #555;
          }

          .text-info {
            color: #007bff !important;
          }

          .text-info:hover {
            text-decoration: none;
          }

          .alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
            border-radius: 5px;
            padding: 10px;
          }
        `}
      </style>
    </>
  );
};

export default AdminLogin;
