import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import toastr from "toastr";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/admin/register", {
        email,
        password,
      });
      if (response.data.success) {
        toastr.success("Registration successful!");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="register-container">
        <div className="register-box">
          <h2 className="text-center">Admin Register</h2>
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
              Register
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link
              to="/login-admin"
              className="text-decoration-underline text-info"
            >
              Login
            </Link>
          </p>
          {message && <p className="alert alert-danger mt-3">{message}</p>}
        </div>
      </div>

      <style>
        {`
          .register-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f8f9fa;
            padding: 20px;
          }

          .register-box {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
          }

          h2 {
            color: #343a40;
            margin-bottom: 20px;
            font-weight: bold;
          }

          .form-label {
            font-weight: 500;
            color: #495057;
          }

          .form-control {
            border-radius: 5px;
            border: 1px solid #ced4da;
            padding: 10px;
            transition: box-shadow 0.3s, border-color 0.3s;
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
            transition: background-color 0.3s, transform 0.2s;
          }

          .btn-primary:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
          }

          p {
            color: #6c757d;
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
