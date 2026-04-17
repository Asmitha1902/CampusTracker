package com.campus.portal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @Column(name = "is_read")
    private boolean read;

    private LocalDateTime createdAt;

    // ✅ ITEM DETAILS
    private String type;
    private String itemName;
    private String location;

    // 🔥 NEW FIELD (IMPORTANT)
    private String matchedUserName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // ✅ Default constructor
    public Notification() {}

    // ✅ OLD constructor
    public Notification(User user, String message) {
        this.user = user;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }

    // 🔥 FINAL CONSTRUCTOR (USE THIS ONLY)
    public Notification(User user, String message, String type,
                        String itemName, String location, String matchedUserName) {
        this.user = user;
        this.message = message;
        this.type = type;
        this.itemName = itemName;
        this.location = location;
        this.matchedUserName = matchedUserName;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }

    // ================= GETTERS =================

    public Long getId() { return id; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public User getUser() { return user; }

    public String getType() { return type; }
    public String getItemName() { return itemName; }
    public String getLocation() { return location; }
    public String getMatchedUserName() { return matchedUserName; }

    // ================= SETTERS =================

    public void setId(Long id) { this.id = id; }
    public void setMessage(String message) { this.message = message; }
    public void setRead(boolean read) { this.read = read; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUser(User user) { this.user = user; }

    public void setType(String type) { this.type = type; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public void setLocation(String location) { this.location = location; }
    public void setMatchedUserName(String matchedUserName) { this.matchedUserName = matchedUserName; }
}