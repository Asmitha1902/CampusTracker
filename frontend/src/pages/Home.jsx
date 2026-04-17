import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg custom-navbar px-4">
        <div className="container-fluid">

          {/* Logo */}
          <div className="d-flex align-items-center">
            <div className="logo-icon me-2">🔍</div>
            <div>
              <h5 className="mb-0 brand-title">Campus Lost & Found</h5>
              <small className="brand-subtitle">University Portal</small>
            </div>
          </div>

          {/* Buttons */}
          <div className="ms-auto">
            <Link 
              to="/login" 
              state={{ mode: "login" }} 
              className="btn login-btn me-3"
            >
              Login
            </Link>

            <Link 
              to="/login" 
              state={{ mode: "register" }} 
              className="btn create-btn"
            >
              Create Account
            </Link>
            <Link 
  to="/admin-login" 
  className="btn create-btn"
>
  Admin Login
</Link>
          </div>

        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero-section text-center py-5">

        <div className="badge-text mb-3">✨ Campus-Wide Lost & Found Platform</div>

        <h1 className="hero-title mb-3">
          Never Lose ,Track of Your <br/>
          <span>Belongings Again</span>
        </h1>

        <p className="hero-subtitle mb-4">
          A smart platform designed exclusively for university students
          to report, search, and recover lost items quickly and securely.
        </p>

        {/* Hero Buttons */}
        <div className="mb-5">
          <Link 
            to="/login" 
            state={{ mode: "register" }} 
            className="btn get-started-btn me-3"
          >
            Get Started Free →
          </Link>

          <Link 
            to="/login" 
            state={{ mode: "login" }} 
            className="btn sign-in-btn"
          >
            Sign In
          </Link>
        </div>

        {/* ================= STATS ================= */}
        <div className="row justify-content-center stats-row">
          <div className="col-6 col-md-2 stat-card">
            <h3 className="stat-number">500+</h3>
            <p>Items Posted</p>
          </div>

          <div className="col-6 col-md-2 stat-card">
            <h3 className="stat-number">85%</h3>
            <p>Match Rate</p>
          </div>

          <div className="col-6 col-md-2 stat-card">
            <h3 className="stat-number">1000+</h3>
            <p>Active Users</p>
          </div>

          <div className="col-6 col-md-2 stat-card">
            <h3 className="stat-number">24/7</h3>
            <p>Available</p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section text-center py-5">
        <h2 className="how-title mb-3">How It Works</h2>
        <p className="how-subtitle mb-5">Get started in three simple steps</p>

        <div className="row justify-content-center">

          <div className="col-12 col-md-3 how-card mb-4">
            <div className="step-circle mb-2">1</div>
            <h5>Sign Up with Campus Email</h5>
            <p>Create your account using your verified university email.</p>
          </div>

          <div className="col-12 col-md-3 how-card mb-4">
            <div className="step-circle mb-2">2</div>
            <h5>Post Lost or Found Items</h5>
            <p>Fill out item details and our system finds matches.</p>
          </div>

          <div className="col-12 col-md-3 how-card mb-4">
            <div className="step-circle mb-2">3</div>
            <h5>Connect & Recover</h5>
            <p>Chat securely and arrange pickup safely.</p>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer-section d-flex justify-content-between align-items-center px-4 py-3">
        <div className="d-flex align-items-center">
          <div className="logo-icon me-2">🔍</div>
          <div>
            <h6 className="mb-0">Campus Lost & Found</h6>
            <small>University Portal</small>
          </div>
        </div>
        <div className="text-end">
          <small>© 2024 Campus Lost & Found</small>
        </div>
      </footer>

    </div>
  );
};

export default Home;