package com.campus.portal.controller;

import com.campus.portal.dto.ChatMessageDTO;
import com.campus.portal.dto.ChatRequestDTO;
import com.campus.portal.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    private Long getUserIdFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        return (Long) session.getAttribute("userId");
    }

    @PostMapping("/request")
    public ResponseEntity<?> createChatRequest(@RequestBody Map<String, Long> payload, HttpServletRequest request) {
        Long userId = getUserIdFromSession(request);
        if (userId == null) return ResponseEntity.status(401).body("Not logged in");

        Long receiverId = payload.get("receiverId");
        Long itemId = payload.get("itemId");

        try {
            return ResponseEntity.ok(chatService.createChatRequest(userId, receiverId, itemId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/request/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> payload, HttpServletRequest request) {
        Long userId = getUserIdFromSession(request);
        if (userId == null) return ResponseEntity.status(401).body("Not logged in");

        try {
            return ResponseEntity.ok(chatService.updateRequestStatus(id, payload.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getUserChatRequests(HttpServletRequest request) {
        Long userId = getUserIdFromSession(request);
        if (userId == null) return ResponseEntity.status(401).body("Not logged in");

        return ResponseEntity.ok(chatService.getUserChatRequests(userId));
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        Long userId = getUserIdFromSession(request);
        if (userId == null) return ResponseEntity.status(401).body("Not logged in");

        Long requestId = Long.parseLong(payload.get("requestId"));
        String content = payload.get("content");

        try {
            return ResponseEntity.ok(chatService.sendMessage(requestId, userId, content));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/messages/{requestId}")
    public ResponseEntity<?> getMessages(@PathVariable Long requestId, HttpServletRequest request) {
        Long userId = getUserIdFromSession(request);
        if (userId == null) return ResponseEntity.status(401).body("Not logged in");

        return ResponseEntity.ok(chatService.getMessages(requestId));
    }
}
