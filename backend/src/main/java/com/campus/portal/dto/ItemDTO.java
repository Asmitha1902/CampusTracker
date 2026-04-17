package com.campus.portal.dto;

import java.time.LocalDate;
import com.campus.portal.entity.Item;
import com.campus.portal.entity.User;

public class ItemDTO {

    private Long id;
    private String itemName;
    private String type;
    private String phone;
    private String location;
    private LocalDate date;
    private String imagePath;
    private String status;
    private String tags;
    private String userName;
    private Long userId;
    private String description;
private String category;
private String itemStatus;
private int matchPercent;
    // Default constructor
    public ItemDTO() {}

    // Constructor from Entity
    public ItemDTO(Item item) {
        this.id = item.getId();
        this.itemName = safe(item.getItemName());
        this.type = safe(item.getType());
        this.phone = safe(item.getPhone());
        this.location = safe(item.getLocation());
        this.date = item.getDate();
        this.imagePath = safe(item.getImagePath());
        this.status = safe(item.getStatus());
        this.tags = safe(item.getTags());
this.description = safe(item.getDescription());
this.category = safe(item.getCategory());
this.itemStatus = safe(item.getItemStatus());
        User user = item.getUser();
        if (user != null) {
            this.userId = user.getId();
            this.userName = (user.getFullName() != null && !user.getFullName().isEmpty())
                    ? safe(user.getFullName())
                    : "Unknown";
        } else {
            this.userName = "Unknown";
        }
    }

    // Helper method
    private String safe(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"")
                    .replace("\n", " ")
                    .replace("\r", " ")
                    .trim();
    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = safe(itemName); }

    public String getType() { return type; }
    public void setType(String type) { this.type = safe(type); }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = safe(phone); }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = safe(location); }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = safe(imagePath); }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = safe(status); }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = safe(tags); }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = safe(userName); }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getDescription() { return description; }
public String getCategory() { return category; }
public String getItemStatus() { return itemStatus; }
public int getMatchPercent() {
    return matchPercent;
}
public void setItemStatus(String itemStatus) {
    this.itemStatus = safe(itemStatus);
}
public void setMatchPercent(int matchPercent) {
    this.matchPercent = matchPercent;
}
}