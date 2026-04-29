import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import {
  Search,
  MessageCircle,
  Package,
  CheckCircle
} from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";


const StudentDashboard = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

    // ✅ FETCH POSTS
    fetch("http://localhost:9090/api/items/approved", {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(err => console.error(err));

    // 🔥 FETCH MATCHES
   
fetch("http://localhost:9090/api/items/matches", {
    method: "GET",
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    })
    .then(data => {
      console.log("MATCHES:", data);
      setMatches(data);
    })
    .catch(err => console.error(err));

}, []); 

  const sendChatRequest = async (matchedItem) => {
    try {
      const res = await fetch("http://localhost:9090/api/chat/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: matchedItem.userId,
          itemId: matchedItem.id
        }),
        credentials: "include"
      });

      if (res.ok) {
        alert("Chat Request sent successfully!");
      } else {
        const err = await res.text();
        alert("Error: " + err);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to send chat request");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  // ✅ COUNTS
 const myPosts = posts.length;

const activePosts = posts.filter(
  (p) => (p.itemStatus || "active").toLowerCase() === "active"
).length;

// 🔥 ONLY FOUND COUNT (IMPORTANT FIX)
const matchedPosts = posts.filter(
  (p) =>
    p.itemStatus?.toLowerCase() === "matched" &&
    p.type?.toLowerCase() === "found"
).length;
  return (

    <div className="dashboard-container">

      <div className="main-content">

        <h2>Dashboard</h2>

        {/* ================= STATS ================= */}
        <div className="stats1">

          <div className="stat1-card">
            <div className="stat1-icon">
              <Package size={20} />
            </div>
            <div className="stat1-info">
              <h3>{myPosts}</h3>
              <p>Total Posts</p>
            </div>
          </div>

          <div className="stat1-card">
            <div className="stat1-icon">
              <CheckCircle size={20} />
            </div>
            <div className="stat1-info">
              <h3>{activePosts}</h3>
              <p>Active</p>
            </div>
          </div>

          <div className="stat1-card">
            <div className="stat1-icon">
              <Search size={20} />
            </div>
            <div className="stat1-info">
              <h3>{matchedPosts}</h3>
              <p>Matched</p>
            </div>
          </div>

          <div className="stat1-card">
            <div className="stat1-icon">
              <MessageCircle size={20} />
            </div>
            <div className="stat1-info">
              <h3>0</h3>
              <p>Messages</p>
            </div>
          </div>

        </div>

        {/* ================= RECENT ACTIVITY ================= */}
{/* ================= RECENT ACTIVITY ================= */}
<h3 className="section-title">Recent Activity</h3>

<div className="activity">
  {!posts || posts.length === 0 ? (
    <p>No recent activity</p>
  ) : (
    [...posts]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3)
      .map((post) => (

        <div className="activity-card" key={post.id}>

          <div className="card-header">

            <span className={`badge ${post.type?.toLowerCase() === "lost" ? "lost" : "found"}`}>
              {post.type?.toUpperCase()}
            </span>

            <span className={`status ${post.itemStatus?.toLowerCase()}`}>
              {(post.itemStatus || "ACTIVE").toUpperCase()}
            </span>

          </div>
          {post.imagePath && (
            <img
              src={`http://localhost:9090/uploads/${post.imagePath}`}
              alt="item"
              className="item-image"
            />
          )}

          <h4 className="item-title">{post.itemName}</h4>

          <p className="desc">{post.description}</p>

          <p className="location">
            <FaMapMarkerAlt className="icon" /> {post.location}
          </p>

          <p className="date">📅 {post.date}</p>

          <div className="tags">
            {(post.tags?.split(",") || []).map((tag, i) => (
              <span key={i} className="tag">
                {tag.trim()}
              </span>
            ))}
          </div>

          <div className="phone-row">
            <span className="phone-number">📞 {post.phone}</span>
            <a href={`tel:${post.phone}`} className="call-btn">Call</a>
          </div>

        </div>

      ))
  )}
</div>


{/* ================= POTENTIAL MATCHES ================= */}
<h3 className="section-title">Potential Matches</h3>

<div className="activity">
  {!matches || matches.length === 0 ? (
    <p>No matches found</p>
  ) : (
    matches.map((item) => (
      <div className="activity-card" key={item.id}>

        <div className="card-header">
          <span className={`badge ${item.type?.toLowerCase() === "lost" ? "lost" : "found"}`}>
            {item.type ? item.type.toUpperCase() : "UNKNOWN"}
          </span>

          {/* ✅ dynamic status */}
          <span className={`status ${item.itemStatus?.toLowerCase()}`}>
            {item.itemStatus}
          </span>
        </div>
        {item.imagePath && (
          <img
            src={`http://localhost:9090/uploads/${item.imagePath}`}
            alt="item"
            className="item-image"
          />
        )}

        <h4 className="item-title">{item.itemName}</h4>

        <p className="desc">{item.description}</p>

        <p className="location">
          📍 {item.location}
        </p>

        <p className="date">📅 {item.date}</p>

        <div className="tags">
          {(item.tags?.split(",") || []).map((tag, i) => (
            <span key={i} className="tag">
              {tag.trim()}
            </span>
          ))}
        </div>

        <div className="phone-row">
          <span>📞 {item.phone}</span>
          <div style={{display: 'flex', gap: '8px'}}>
            <a href={`tel:${item.phone}`} className="call-btn">Call</a>
            <button className="chat-req-btn" onClick={() => sendChatRequest(item)} style={{background: '#4f46e5', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', transition: '0.3s'}}>Chat</button>
          </div>
        </div>



      </div>
    ))
  )}
</div>

      </div>

    </div>

  );
};

export default StudentDashboard;