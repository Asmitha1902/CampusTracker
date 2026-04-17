import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./SidebarLayout.css";
import { LayoutDashboard, Search, Box, Settings, MessageCircle } from "lucide-react";
import { FaUserCircle, FaBell } from "react-icons/fa";

const SidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const [unreadCount, setUnreadCount] = useState(0);

  // 🔥 FETCH UNREAD COUNT
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(
          "http://localhost:9090/api/notifications/my",
          { credentials: "include" }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          const count = data.filter((n) => !n.read).length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCount();

    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout-container">

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">

        <h2 className="logo">
          <span className="logo-icon">
            <Search size={16} />
          </span>
          CampusFind
        </h2>

        <ul className="menu">
          <li
            className={location.pathname === "/dashboard" ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </li>

          <li
            className={location.pathname === "/browse" ? "active" : ""}
            onClick={() => navigate("/browse")}
          >
            <Search size={18} /> Browse Items
          </li>

          <li
            className={location.pathname === "/my-posts" ? "active" : ""}
            onClick={() => navigate("/my-posts")}
          >
            <Box size={18} /> My Posts
          </li>

          <li
            className={location.pathname === "/lostfound" ? "active" : ""}
            onClick={() => navigate("/lostfound")}
          >
            <Box size={18} /> Lost & Found
          </li>

          <li
            className={location.pathname === "/profile" ? "active" : ""}
            onClick={() => navigate("/profile")}
          >
            <Settings size={18} /> Profile Settings
          </li>

          {/* 🔔 NOTIFICATIONS */}
          <li
            className={location.pathname === "/notifications" ? "active" : ""}
            onClick={() => navigate("/notifications")}
            style={{ position: "relative" }}
          >
            <FaBell size={18} /> Notifications

            {unreadCount > 0 && (
              <span className="notif-badge">
                {unreadCount}
              </span>
            )}
          </li>

          {/* CHATS */}
          <li
            className={location.pathname === "/chat" ? "active" : ""}
            onClick={() => navigate("/chat")}
          >
            <MessageCircle size={18} /> Chats
          </li>
        </ul>

        {/* ================= USER INFO ================= */}
        <div className="user-box">
          <FaUserCircle className="user-icon" />
          <div className="user-info">
            <p className="user-name">{user?.fullName}</p>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <div className="user-divider"></div>

        <button onClick={logout} className="logout-btn">
          Sign Out
        </button>

      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="content">
        <Outlet />
      </div>

    </div>
  );
};

export default SidebarLayout;