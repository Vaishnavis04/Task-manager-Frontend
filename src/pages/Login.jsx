import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="blob-container">
          <h1 className="project-title">My Awesome Project</h1>
          <p className="project-description">
            Streamline task assignments, track progress, and collaborate effortlessly with our smart dashboard built for modern teams.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            <div className="signup-link">
              New user? <a href="/signup">Signup</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
