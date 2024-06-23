import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { auth, login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth-token/",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      login(token, username);
      setMessage(`Hello, ${username}!`);
      navigate("/home");
    } catch (error) {
      console.error(error);
      setMessage("Login failed. Please check your username and password.");
    }
  };

  if (auth.token) {
    // Redirect to home page if already logged in.
    return <Navigate to="/home" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "400px" }}>
        <h2 className="fw-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="form w-100" noValidate>
          <div className="mb-3">
            <label className="form-label fs-6 fw-semibold">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fs-6 fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-lg btn-primary w-100 mb-3">
            Login
          </button>
        </form>
        {message && <p className="text-center text-danger">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
