package com.campus.portal.dto;

import com.campus.portal.entity.ChatMessage;
import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private Long chatRequestId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;

    public ChatMessageDTO() {}

    public ChatMessageDTO(ChatMessage msg) {
        this.id = msg.getId();
        this.chatRequestId = msg.getChatRequest().getId();
        this.senderId = msg.getSender().getId();
        this.senderName = msg.getSender().getFullName();
        this.content = msg.getContent();
        this.timestamp = msg.getTimestamp();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getChatRequestId() { return chatRequestId; }
    public void setChatRequestId(Long chatRequestId) { this.chatRequestId = chatRequestId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String  getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
