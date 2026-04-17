import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

const CampusAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (location.state?.mode === "register") setIsRegister(true);
    else setIsRegister(false);
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidCollegeEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ac\.in|edu\.in)$/.test(email);

  // ================= HELPER: SHOW TEMPORARY MESSAGE =================
  const showMessage = (type, msg, duration = 4000) => {
    if (type === "error") setErrorMessage(msg);
    if (type === "success") setSuccessMessage(msg);

    setTimeout(() => {
      if (type === "error") setErrorMessage("");
      if (type === "success") setSuccessMessage("");
    }, duration);
  };

  // ================= REGISTER =================
  const handleRegister = async () => {
    setShowOtpBox(false);

    if (!formData.fullName || !formData.studentId || !formData.email || !formData.password) {
      showMessage("error", "All fields are required");
      return;
    }

    if (!isValidCollegeEmail(formData.email)) {
      showMessage("error", "Only valid college email (.ac.in or .edu) allowed");
      return;
    }

    try {
     const res = await fetch("http://localhost:9090/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // 🔥 ADD THIS
  body: JSON.stringify(formData)
});

      const text = await res.text();

      if (!res.ok) {
        showMessage("error", text || "Something went wrong");
        return;
      }

      showMessage("success", text);
      setShowOtpBox(true);
    } catch {
      showMessage("error", "Server not reachable");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    if (!otp) {
      showMessage("error", "Enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:9090/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp })
      });

      const message = await res.text();

      if (!res.ok) {
        showMessage("error", message);
        return;
      }

      showMessage("success", message);
      setShowOtpBox(false);
      setIsRegister(false);
    } catch {
      showMessage("error", "Server error");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {

  if (!formData.email || !formData.password) {
    showMessage("error", "Enter email and password");
    return;
  }

  try {
    const res = await fetch("http://localhost:9090/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password
  }),
  credentials: "include" // 🔥 ADD THIS LINE
});

    const data = await res.json();

    if (!res.ok) {
      showMessage("error", data.message || "Login failed");
      return;
    }

    showMessage("success", data.message);

    // ⭐ save user
   localStorage.setItem("user", JSON.stringify({
  id: data.id,
  fullName: data.fullName,
  email: data.email
}));

    window.location.href = "/dashboard";

  } catch {
    showMessage("error", "Server error");
  }
};
  // ================= FORGOT PASSWORD =================
  const handleForgotPassword = async () => {
    if (!formData.email) {
      showMessage("error", "Enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:9090/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message);
        return;
      }

      setForgotMode(true);
      setShowOtpBox(true);
      showMessage("success", "Reset OTP sent to email");
    } catch {
      showMessage("error", "Server error");
    }
  };

  const resetPassword = async () => {
    if (!otp || !formData.password) {
      showMessage("error", "Enter OTP and new password");
      return;
    }

    try {
      const res = await fetch("http://localhost:9090/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp, password: formData.password })
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message);
        return;
      }

      setForgotMode(false);
      setShowOtpBox(false);
      showMessage("success", "Password Updated Successfully ✅");
    } catch {
      showMessage("error", "Server error");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9090/oauth2/authorization/google";
  };

  return (
    <div className="auth-wrapper">
      <button className="back-btn" onClick={() => navigate("/")}>← Back to Home</button>

      <div className="auth-card">
        <div className="auth-left campus">
          <div className="left-content">
            <div className="icon">🎓</div>
            <h1>Campus Lost & Found</h1>
            <p>Securely report, search and recover lost belongings within your university campus.</p>
            <div className="feature">✓ Report Lost Items</div>
            <div className="feature">✓ Post Found Items</div>
            <div className="feature">✓ Secure Student Verification</div>
          </div>
        </div>

        <div className="auth-right">
          <div className="form-container">
            <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p className="sub-text">{isRegister ? "Register as a new student" : "Sign in to your account"}</p>

            {errorMessage && <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green", marginBottom: "10px" }}>{successMessage}</p>}

            {!isRegister ? (
              <>
                <div className="input-group">
                  <input type="email" name="email" required onChange={handleChange} />
                  <label>College Email</label>
                </div>

                <div className="input-group">
                  <input type="password" name="password" required onChange={handleChange} />
                  <label>Password</label>
                </div>

                <p style={{ textAlign: "right", cursor: "pointer", fontSize: "14px" }} onClick={handleForgotPassword}>
                  Forgot Password?
                </p>

                <button className="primary-btn campus" onClick={handleLogin}>Sign In</button>

                <div className="divider"><span>Or continue with</span></div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" />
                  Continue with Google
                </button>

                <p className="bottom-text campus">
                  Don’t have an account? <span onClick={() => setIsRegister(true)}>Create Account</span>
                </p>
              </>
            ) : (
              <>
                <div className="double-row">
                  <div className="input-group">
                    <input type="text" name="fullName" required onChange={handleChange} />
                    <label>Full Name</label>
                  </div>

                  <div className="input-group">
                    <input type="text" name="studentId" required onChange={handleChange} />
                    <label>Student ID</label>
                  </div>
                </div>

                <div className="input-group">
                  <input type="email" name="email" required onChange={handleChange} />
                  <label>College Email</label>
                </div>

                <div className="input-group">
                  <input type="password" name="password" required onChange={handleChange} />
                  <label>Password</label>
                </div>

                <button className="primary-btn campus" onClick={handleRegister}>Create Account</button>

                <div className="divider"><span>Or continue with</span></div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" />
                  Continue with Google
                </button>

                <p className="bottom-text campus">
                  Already have an account? <span onClick={() => setIsRegister(false)}>Sign In</span>
                </p>
              </>
            )}

            {showOtpBox && (
              <>
                <div className="input-group">
                  <input type="text" onChange={(e) => setOtp(e.target.value)} />
                  <label>Enter OTP</label>
                </div>

                <button className="primary-btn campus" onClick={forgotMode ? resetPassword : verifyOtp}>
                  Verify OTP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusAuth;