import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import API from "../utils/api";

const Signup = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/auth/signup", {
        username,
        password,
        email: email.trim() === "" ? undefined : email.trim(),
      });

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="signup-wrapper">
      {/* === Left Hero Section === */}
      <div className="signup-left">
        <div className="project-title">My Awesome Project</div>
        <div className="project-description">
          Create your account and get started today! Explore a modern dashboard,
          seamless UX, and everything you need in one place.
        </div>
      </div>

      {/* === Right Signup Form === */}
      <div className="signup-right">
        <div className={`signup-box ${fadeIn ? "fade-in" : ""}`}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {message && (
              <p style={{ color: "green", marginTop: 8 }}>{message}</p>
            )}
            {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

            <button type="submit">Create Account</button>

            <p className="login-link">
              Already have an account?
              <a href="/"> Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
