import React, { useEffect, useState } from "react";
import "./ApprovePosts.css";

const ApprovePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ Fetch pending items
  // ✅ Fetch pending items (already correct)
const fetchPosts = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch("http://localhost:9090/api/items/pending", {
      credentials: "include" // ✅ OK
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    setPosts(data);

  } catch (err) {
    console.error("Error fetching posts:", err);
    setError("Failed to load posts");
    setPosts([]);
  } finally {
    setLoading(false);
  }
};

// ✅ Approve item (FIX HERE)
const handleApprove = async (id) => {
  try {
    const res = await fetch(`http://localhost:9090/api/items/approve/${id}`, {
      method: "PUT",
      credentials: "include" // 🔥 ADD THIS
    });

    if (!res.ok) throw new Error("Failed to approve");
    fetchPosts();

  } catch (err) {
    console.error(err);
    alert("Error approving item");
  }
};

// ✅ Reject item (FIX HERE)
const handleReject = async (id) => {
  try {
    const res = await fetch(`http://localhost:9090/api/items/reject/${id}`, {
      method: "PUT",
      credentials: "include" // 🔥 ADD THIS
    });

    if (!res.ok) throw new Error("Failed to reject");
    fetchPosts();

  } catch (err) {
    console.error(err);
    alert("Error rejecting item");
  }
};

// ✅ Remove item (FIX HERE)
const handleRemove = async (id) => {
  try {
    const res = await fetch(`http://localhost:9090/api/items/${id}`, {
      method: "DELETE",
      credentials: "include" // 🔥 ADD THIS
    });

    if (!res.ok) throw new Error("Failed to delete");
    fetchPosts();

  } catch (err) {
    console.error(err);
    alert("Error deleting item");
  }
};

  return (
    <div className="approve-container">
      {loading && <p>Loading pending items...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="approve-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Item</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Posted By</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.length === 0 && !loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                ❌ No pending items
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post.id}>
                <td>
                  {post.imagePath ? (
                    <img
                      src={`http://localhost:9090/uploads/${post.imagePath}`}
                      alt={post.itemName}
                      width="50"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{post.itemName}</td>
                <td>
                  <span className={`badge22 ${post.type?.toLowerCase()}`}>
                    {post.type}
                  </span>
                </td>
                <td>{post.phone}</td>
                <td>{post.location}</td>
                <td>
                  {post.date
                    ? new Date(post.date).toLocaleDateString()
                    : "-"}
                </td>
                <td>{post.userName || "Unknown"}</td>

                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(post.id)}
                  >
                    ✔ Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(post.id)}
                  >
                    ✖ Reject
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(post.id)}
                  >
                    🗑 Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovePosts;