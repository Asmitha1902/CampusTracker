package com.campus.portal.controller;

import com.campus.portal.entity.Notification;
import com.campus.portal.entity.User;
import com.campus.portal.repository.NotificationRepository;
import com.campus.portal.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ GET NOTIFICATIONS
    @GetMapping("/my")
    public ResponseEntity<?> getMyNotifications(HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        if (session == null) return ResponseEntity.status(401).body("Session expired");

        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(401).body("Not logged in");

        List<Notification> notifications =
                notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> response = notifications.stream()
                .map(n -> {
                    Map<String, Object> map = new HashMap<>();

                    map.put("id", n.getId());
                    map.put("message", n.getMessage());
                    map.put("title", n.getItemName());
                    map.put("location", n.getLocation());
                    map.put("matchedUserName", n.getMatchedUserName());
                    map.put("date", n.getCreatedAt().toString());
                    map.put("read", n.isRead());

                    return map;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    // ✅ ADD NOTIFICATION
    @PostMapping("/add")
    public ResponseEntity<?> addNotification(
            @RequestParam Long userId,
            @RequestParam String message,
            @RequestParam String type,
            @RequestParam String itemName,
            @RequestParam String location,
            @RequestParam String matchedUserName   // 🔥 IMPORTANT
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification(
                user,
                message,
                type,
                itemName,
                location,
                matchedUserName
        );

        notificationRepository.save(notification);

        return ResponseEntity.ok("Notification sent");
    }

    // ✅ MARK AS READ
    @PutMapping("/read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok("Marked as read");
    }
}