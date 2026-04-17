import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    studentId: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch("http://localhost:9090/api/users/me", {
        credentials: "include",
      });
      const data = await res.json();
      setUser({
        fullName: data.fullName || "",
        email: data.email || "",
        studentId: data.studentId || "",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await fetch("http://localhost:9090/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const res = await fetch("http://localhost:9090/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwords),
      });
      const msg = await res.text();
      alert(msg);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      alert("Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-wrapper">
        <div className="profile-loader"></div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper fade-in">
      <div className="profile-hero">
        <div className="profile-hero-overlay"></div>
      </div>

      <div className="profile-content">
        <div className="profile-main-card">
          
          <div className="profile-header-premium">
            <div 
              className={`profile-avatar-premium ${isHovered ? 'hover-effect' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {user.fullName?.charAt(0).toUpperCase() || "U"}
              <div className="avatar-ring"></div>
            </div>
            
            <div className="profile-titles">
              <h2>{user.fullName}</h2>
              <div className="profile-badges">
                <span className="badge-primary">🎓 {user.studentId || "No ID"}</span>
                <span className="badge-secondary">Student</span>
              </div>
            </div>
          </div>

          <div className="profile-sections-wrapper">
            {/* Personal Details Section */}
            <div className="profile-section fade-in delay-1">
              <div className="section-header">
                <h3>Personal Information</h3>
                <p>Update your details and how we can reach you</p>
              </div>
              
              <div className="premium-form-grid">
                <div className="input-group-premium">
                  <label>Full Name</label>
                  <input
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  <div className="input-highlight"></div>
                </div>

                <div className="input-group-premium">
                  <label>Student ID</label>
                  <input
                    name="studentId"
                    value={user.studentId}
                    onChange={handleChange}
                    placeholder="e.g. 23r21a66c5"
                  />
                  <div className="input-highlight"></div>
                </div>

                <div className="input-group-premium disabled">
                  <label>University Email</label>
                  <input value={user.email} disabled />
                  <span className="lock-icon">🔒</span>
                </div>
              </div>
              
              <button className="primary-action-btn" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>

            <div className="section-divider"></div>

            {/* Security Section */}
            <div className="profile-section fade-in delay-2">
              <div className="section-header security-header">
                <h3>Account Security</h3>
                <p>Ensure your account is using a strong password</p>
              </div>

              <div className="premium-form-grid">
                <div className="input-group-premium">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <div className="input-highlight"></div>
                </div>

                <div className="input-group-premium">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <div className="input-highlight"></div>
                </div>
              </div>

              <button className="secondary-action-btn" onClick={handlePasswordSubmit}>
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}