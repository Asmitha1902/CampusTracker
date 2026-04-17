package com.campus.portal.repository;

import com.campus.portal.entity.Notification;
import com.campus.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // ✅ Get notifications sorted (latest first)
    List<Notification> findByUser_IdOrderByCreatedAtDesc(Long userId);

    // ✅ Prevent duplicate notifications
    boolean existsByUserAndMessage(User user, String message);

    // 🔥 OPTIONAL (very useful)
    
    // ✅ Get only unread notifications
    List<Notification> findByUser_IdAndReadFalseOrderByCreatedAtDesc(Long userId);

    // ✅ Count unread notifications (for badge)
    long countByUser_IdAndReadFalse(Long userId);
}