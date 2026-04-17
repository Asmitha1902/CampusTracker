import React, { useEffect, useState } from "react";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:9090/api/admin/users", {
        credentials: "include",
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search users
  const fetchSearchUsers = async (query) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:9090/api/admin/users/search?name=${query}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load all users on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ LIVE SEARCH (Debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        fetchUsers();
      } else {
        fetchSearchUsers(search);
      }
    }, 500); // delay for typing

    return () => clearTimeout(delay);
  }, [search]);

  // ✅ Delete user
  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:9090/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Toggle status
  const toggleStatus = async (id) => {
    try {
      await fetch(`http://localhost:9090/api/admin/users/toggle/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manage-users1">
      <h2>Manage Users</h2>

      <div className="user-count1">
        Total Users: <span>{users.length}</span>
      </div>

      {/* ✅ SEARCH BAR (LIVE) */}
      <div className="search-box1">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      <table className="users-table1">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>College ID</th>
            <th>Role</th>
            <th>Status</th>
            <th>Posts</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && !loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                ❌ No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>

                <td>
                  <b>{user.fullName}</b>
                  <br />
                  <small>{user.email}</small>
                </td>

                <td>{user.studentId}</td>
                <td>{user.role}</td>

                <td>
                  <span className={user.emailVerified ? "active1" : "inactive1"}>
                    {user.emailVerified ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{user.postCount}</td>

                <td>{user.joinedDate || "-"}</td>

                <td>
                  <button
                    className="toggle1-btn"
                    onClick={() => toggleStatus(user.id)}
                  >
                    Toggle
                  </button>

                  <button
                    className="delete1-btn"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
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

export default ManageUsers;