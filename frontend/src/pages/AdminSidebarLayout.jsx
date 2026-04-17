import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebarLayout.css";
import { LayoutDashboard, Users, FileText, BarChart2, LogOut } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const AdminSidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = JSON.parse(localStorage.getItem("admin"));
  const basePath = "/admin-dashboard"; // base path for admin routes

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">CampusFind</h2>

        <ul className="admin-menu">
          <li
            className={location.pathname === basePath ? "admin-active" : ""}
            onClick={() => navigate(basePath)}
          >
            <LayoutDashboard size={18} /> Dashboard
          </li>

          <li
            className={location.pathname === `${basePath}/approve-posts` ? "admin-active" : ""}
            onClick={() => navigate(`${basePath}/approve-posts`)}
          >
            <FileText size={18} /> Approve Posts
          </li>

          <li
            className={location.pathname === `${basePath}/manage-users` ? "admin-active" : ""}
            onClick={() => navigate(`${basePath}/manage-users`)}
          >
            <Users size={18} /> Manage Users
          </li>

          <li
            className={location.pathname === `${basePath}/reports` ? "admin-active" : ""}
            onClick={() => navigate(`${basePath}/reports`)}
          >
            <BarChart2 size={18} /> Reports
          </li>
        </ul>

        {/* Bottom Section */}
        <div className="admin-bottom">
          <div className="admin-user-box">
            <FaUserCircle className="admin-user-icon" />
            <div>
              <p className="admin-user-name">{admin?.name || "Admin"}</p>
              <small className="admin-user-email">{admin?.email}</small>
            </div>
          </div>
          <button onClick={logout} className="admin-logout-btn">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <Outlet /> {/* nested admin pages render here */}
      </div>
    </div>
  );
};

export default AdminSidebarLayout;