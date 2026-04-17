import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    alert("Please enter email and password");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:9090/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
      }),
      credentials: "include" // ✅ IMPORTANT
    });

    // ✅ SAFE JSON PARSE
    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (response.status === 200 && result.status === "SUCCESS") {
      localStorage.setItem("admin", JSON.stringify(result.admin));

      alert("Login Successful");
      navigate("/admin-dashboard");

    } else if (response.status === 401) {
      alert("Invalid email or password");

    } else if (response.status === 403) {
      alert("Access denied (check backend security)");

    } else {
      alert("Unexpected error occurred");
      console.error("Login response:", result);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Cannot connect to server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-login-wrapper">
      <button className="back-btn" onClick={() => navigate("/")}>← Back to Home</button>
      <div className="admin-login-card">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}