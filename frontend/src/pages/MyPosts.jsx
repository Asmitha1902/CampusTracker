import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPosts.css";

const MyPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:9090/api/items/my-posts", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  // 🔥 FILTER LOGIC (UPDATED)
  const filteredPosts = posts.filter(post => {

    if (filter === "all") return true;

    if (filter === "matched") {
      return post.itemStatus?.toLowerCase() === "matched";
    }

    return post.type?.toLowerCase() === filter;
  });

  // 🔥 DELETE
  const deletePost = async (id) => {
    await fetch(`http://localhost:9090/api/items/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="myposts-container1">

      <h2 className="title1">My Posts</h2>

      {/* 🔥 FILTER BUTTONS */}
      <div className="filters">

        <button 
          className={filter==="all"?"active":""} 
          onClick={()=>setFilter("all")}
        >
          All ({posts.length})
        </button>

        <button 
          className={filter==="lost"?"active":""} 
          onClick={()=>setFilter("lost")}
        >
          Lost
        </button>

        <button 
          className={filter==="found"?"active":""} 
          onClick={()=>setFilter("found")}
        >
          Found
        </button>

        {/* 🔥 NEW MATCHED BUTTON */}
        <button 
          className={filter==="matched"?"active":""} 
          onClick={()=>setFilter("matched")}
        >
          Matched
        </button>

      </div>

      <div className="posts-grid1">
        {filteredPosts.map(post => (
          <div key={post.id} className="card11">

            {/* BADGE */}
            <span className={`badge11 ${post.type}`}>
              {post.type?.toUpperCase()}
            </span>

            {/* 🔥 STATUS FIX */}
            <span className={`status11 ${post.itemStatus?.toLowerCase()}`}>
              {(post.itemStatus || "ACTIVE").toUpperCase()}
            </span>

            {/* TOP SECTION */}
            <div className="top-section">

              {/* IMAGE */}
              {post.imagePath && (
                <img
                  src={`http://localhost:9090/uploads/${post.imagePath}`}
                  alt="item"
                  className="item11-img"
                />
              )}

              <div>
                <h3>{post.itemName}</h3>
                <p className="desc">{post.description}</p>

                <p>📍 {post.location}</p>
                <p>📅 {post.date}</p>

                {/* TAGS */}
                <div className="tags11">🏷️
                  {(post.tags?.split(",") || []).map((tag, i) => (
                    <span key={i}>{tag.trim()}</span>
                  ))}
                </div>
              </div>

            </div>

            {/* PHONE */}
            <div className="bottom-row">
              <span>📞 {post.phone}</span>
              <a href={`tel:${post.phone}`} className="call-btn">Call</a>
            </div>

            {/* ACTION */}
            <div className="actions">
              {post.itemStatus?.toLowerCase() === "matched" && (
                <button 
                  className="chat-btn"
                  onClick={() => navigate("/chat")}
                  style={{background: '#4f46e5', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', marginRight: '10px'}}
                >
                  Chat
                </button>
              )}
              <button 
                className="delete-btn"
                onClick={()=>deletePost(post.id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default MyPosts;