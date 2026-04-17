package com.campus.portal.controller;

import com.campus.portal.entity.User;
import com.campus.portal.dto.UserDTO;
import com.campus.portal.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // =========================
    // ✅ GET LOGGED IN USER
    // =========================
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(401).body("Session expired");
        }

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ DTO send (safe)
        return ResponseEntity.ok(new UserDTO(user));
    }

    // =========================
    // ✅ UPDATE PROFILE
    // =========================
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestBody User updatedUser,
            HttpServletRequest request
    ) {

        HttpSession session = request.getSession(false);
        Long userId = (Long) session.getAttribute("userId");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(updatedUser.getFullName());
        user.setStudentId(updatedUser.getStudentId());

        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    // =========================
    // 🔥 CHANGE PASSWORD
    // =========================
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> passwords,
            HttpServletRequest request
    ) {

        HttpSession session = request.getSession(false);
        Long userId = (Long) session.getAttribute("userId");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        // ⚠️ SIMPLE CHECK (later BCrypt use cheyyi)
        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body("Current password incorrect ❌");
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully ✅");
    }
}