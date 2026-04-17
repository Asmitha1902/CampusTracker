package com.campus.portal.dto;

import com.campus.portal.entity.User;
import java.time.format.DateTimeFormatter;

public class UserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String studentId;
    private boolean emailVerified;

    private int postCount;
    private String joinedDate;
    private String role; // ✅ ADD ROLE HERE

    // Default constructor
    public UserDTO() {}

    // Constructor using Entity
    public UserDTO(User user) {
        if (user != null) {

            this.id = user.getId();
            this.fullName = user.getFullName();
            this.email = user.getEmail();
            this.studentId = user.getStudentId();
            this.emailVerified = user.isEmailVerified();

            // ✅ ROLE (IMPORTANT FIX)
            this.role = (user.getRole() != null)
                    ? user.getRole().name()
                    : "USER";

            // ✅ POST COUNT
            this.postCount = (user.getItems() != null)
                    ? user.getItems().size()
                    : 0;

            // ✅ JOINED DATE
            if (user.getCreatedAt() != null) {
                this.joinedDate = user.getCreatedAt()
                        .format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            } else {
                this.joinedDate = "N/A";
            }
        }
    }

    // =====================
    // GETTERS
    // =====================

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getStudentId() { return studentId; }
    public boolean isEmailVerified() { return emailVerified; }
    public int getPostCount() { return postCount; }
    public String getJoinedDate() { return joinedDate; }

    // ✅ ROLE GETTER
    public String getRole() { return role; }

    // =====================
    // SETTERS
    // =====================

    public void setId(Long id) { this.id = id; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public void setPostCount(int postCount) { this.postCount = postCount; }
    public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }
    public void setRole(String role) { this.role = role; }
}