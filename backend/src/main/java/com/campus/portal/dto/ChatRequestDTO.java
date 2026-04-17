package com.campus.portal.dto;

import com.campus.portal.entity.ChatRequest;
import java.time.LocalDateTime;

public class ChatRequestDTO {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long itemId;
    private String itemName;
    private String status;
    private LocalDateTime createdAt;
    
    public ChatRequestDTO() {}

    public ChatRequestDTO(ChatRequest req) {
        this.id = req.getId();
        this.senderId = req.getSender().getId();
        this.senderName = req.getSender().getFullName();
        this.receiverId = req.getReceiver().getId();
        this.receiverName = req.getReceiver().getFullName();
        this.itemId = req.getItem().getId();
        this.itemName = req.getItem().getItemName();
        this.status = req.getStatus();
        this.createdAt = req.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
