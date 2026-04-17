package com.campus.portal.controller;

import com.campus.portal.dto.UserDTO;
import com.campus.portal.entity.User;
import com.campus.portal.repository.UserRepository;
import com.campus.portal.repository.ItemRepository; // ✅ NEW
import com.campus.portal.service.AdminService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository; // ✅ NEW

    public AdminController(AdminService adminService,
                           UserRepository userRepository,
                           ItemRepository itemRepository) { // ✅ NEW

        this.adminService = adminService;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    // =========================================
    // 🔐 CHECK ADMIN SESSION
    // =========================================
    private boolean isAdminLoggedIn(HttpSession session) {
        return session != null && session.getAttribute("admin") != null;
    }

    // =========================================
    // 🔐 ADMIN LOGIN
    // =========================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request,
                                  HttpServletRequest httpRequest) {

        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILURE",
                    "message", "Invalid request"
            ));
        }

        Object admin = adminService.login(
                request.getEmail().trim(),
                request.getPassword().trim()
        );

        if (admin != null) {
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("admin", admin);

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "admin", admin
            ));
        }

        return ResponseEntity.status(401).body(Map.of(
                "status", "FAILURE",
                "message", "Invalid credentials"
        ));
    }

    // =========================================
    // 👥 GET ALL USERS
    // =========================================
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(HttpSession session) {

        if (!isAdminLoggedIn(session)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        List<UserDTO> users = userRepository.findAll()
                .stream()
                .map(user -> {
                    UserDTO dto = new UserDTO(user);

                    // ✅ FIX: REAL POST COUNT FROM DB
                    int count = itemRepository.countByUserId(user.getId());
                    dto.setPostCount(count);

                    return dto;
                })
                .toList();

        return ResponseEntity.ok(users);
    }

    // =========================================
    // 🔍 SEARCH USERS
    // =========================================
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String name,
                                         HttpSession session) {

        if (!isAdminLoggedIn(session)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        List<UserDTO> users = userRepository
                .findByFullNameContainingIgnoreCase(name)
                .stream()
                .map(user -> {
                    UserDTO dto = new UserDTO(user);

                    int count = itemRepository.countByUserId(user.getId());
                    dto.setPostCount(count);

                    return dto;
                })
                .toList();

        return ResponseEntity.ok(users);
    }

    // =========================================
    // ❌ DELETE USER
    // =========================================
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
                                        HttpSession session) {

        if (!isAdminLoggedIn(session)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User not found");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // =========================================
    // 🔄 TOGGLE ACTIVE / INACTIVE
    // =========================================
    @PutMapping("/users/toggle/{id}")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id,
                                              HttpSession session) {

        if (!isAdminLoggedIn(session)) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(!user.isEmailVerified());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(new UserDTO(updatedUser));
    }

    // =========================================
    // 📦 LOGIN DTO
    // =========================================
    public static class AdminLoginRequest {
        private String email;
        private String password;

        public AdminLoginRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}