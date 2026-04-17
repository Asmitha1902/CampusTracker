import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Notifications.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const prevCountRef = useRef(0);

  // 🔥 Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:9090/api/notifications/my",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        // 🔔 Toast for new notification
        if (data.length > prevCountRef.current) {
          toast.success(data[0]?.message || "New Notification");
        }

        prevCountRef.current = data.length;
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }, []);

  // 🔄 Auto refresh
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);
const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <div className="notif-page">
      <ToastContainer />

      <div className="notif-box">
        <h2 className="notif-title">
  🔔 Notifications 
  {unreadCount > 0 && (
    <span className="notif-count">({unreadCount})</span>
  )}
</h2>

        {notifications.length === 0 ? (
          <p className="empty">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-card ${n.read ? "read" : "unread"}`}
            >
              {/* MESSAGE */}
              <div className="notif-message">{n.message}</div>

              {/* ITEM */}
              <div className="notif-detail">
                📦 {n.title || "N/A"}
              </div>

              {/* LOCATION */}
              <div className="notif-detail">
                📍 {n.location || "N/A"}
              </div>

              {/* MATCHED USER */}
              <div className="notif-detail">
                👤 {n.matchedUserName || "Unknown"}
              </div>

              {/* DATE */}
              <div className="notif-date">
                📅{" "}
                {n.date
                  ? new Date(n.date).toLocaleString()
                  : ""}
              </div>

              {/* MARK AS READ */}
              {!n.read && (
                <button
                  className="mark-btn"
                  onClick={async () => {
                    await fetch(
                      `http://localhost:9090/api/notifications/read/${n.id}`,
                      {
                        method: "PUT",
                        credentials: "include",
                      }
                    );
                    fetchNotifications();
                  }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;