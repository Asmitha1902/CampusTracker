package com.campus.portal.controller;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.campus.portal.dto.ItemDTO;
import com.campus.portal.entity.Item;
import com.campus.portal.entity.User;
import com.campus.portal.repository.UserRepository;
import com.campus.portal.service.ItemService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ItemController {

    private final ItemService service;
    private final UserRepository userRepository;

    public ItemController(ItemService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    // ================= REPORT ITEM =================
    @PostMapping(value = "/report", consumes = "multipart/form-data")
    public ResponseEntity<?> reportItem(
            @RequestParam String type,
            @RequestParam String itemName,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String location,
            @RequestParam String date,
            @RequestParam(required = false) String tags,
            @RequestParam String phone,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpServletRequest request
    ) {
        try {
            HttpSession session = request.getSession(false);

            if (session == null) {
                return ResponseEntity.status(401).body("Session expired. Please login again.");
            }

            // ✅ Use userId (BEST PRACTICE)
            Long userId = (Long) session.getAttribute("userId");

            if (userId == null) {
                return ResponseEntity.status(401).body("User not logged in");
            }

            // ✅ Fetch user from DB
            User loggedInUser = userRepository.findById(userId).orElse(null);

            if (loggedInUser == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            // ✅ Parse date
            java.time.LocalDate parsedDate;
            try {
                parsedDate = java.time.LocalDate.parse(date);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid date format (yyyy-MM-dd)");
            }

            // ✅ Create item
            Item item = new Item();
            item.setType(type.toLowerCase());
            item.setItemName(itemName);
            item.setDescription(description);
            item.setCategory(category);
            item.setLocation(location);
            item.setDate(parsedDate);
            item.setTags(tags != null ? tags.trim() : null);
            item.setPhone(phone);

            item.setStatus("PENDING");
            item.setItemStatus("ACTIVE");

            // 🔥 Link user
            item.setUser(loggedInUser);

            Item saved = service.save(item, image);

            return ResponseEntity.ok(new ItemDTO(saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error saving item: " + e.getMessage());
        }
    }

    // ================= APPROVED ITEMS =================
 @GetMapping("/approved")
public ResponseEntity<?> getApprovedItems() {
    try {
        return ResponseEntity.ok(service.getItemsByStatusDTO("APPROVED"));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500)
                .body("Error fetching approved items");
    }
}
    // ================= PENDING ITEMS =================
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingItems() {
        try {
            return ResponseEntity.ok(service.getItemsByStatusDTO("PENDING"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error fetching pending items");
        }
    }

    // ================= APPROVE =================
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveItem(@PathVariable Long id) {
        try {
            service.approveItem(id);
            return ResponseEntity.ok("APPROVED");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error approving item");
        }
    }

    // ================= REJECT =================
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectItem(@PathVariable Long id) {
        try {
            service.rejectItem(id);
            return ResponseEntity.ok("REJECTED");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error rejecting item");
        }
    }

    // ================= UPDATE STATUS =================
    @PutMapping("/item-status/{id}")
    public ResponseEntity<?> updateItemStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            service.updateItemStatus(id, status);
            return ResponseEntity.ok("UPDATED");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error updating item status");
        }
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            service.deleteItem(id);
            return ResponseEntity.ok("DELETED");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error deleting item");
        }
    }
    // ================= MY POSTS =================
@GetMapping("/my-posts")
public ResponseEntity<?> getMyPosts(HttpServletRequest request) {
    try {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(401).body("Session expired");
        }

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        return ResponseEntity.ok(service.getItemsByUserId(userId));

    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error");
    }
}

@GetMapping("/matches")
public ResponseEntity<?> getMatches(HttpServletRequest request) {

    try {
        HttpSession session = request.getSession(false);

        // ❌ No session
        if (session == null) {
            return ResponseEntity.status(401).body("Session not found");
        }

        // ❌ No userId in session
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("User not logged in");
        }

        // ✅ Debug (important)
        System.out.println("USER ID: " + userId);

        List<ItemDTO> matches = service.findMatchesForUser(userId);

        System.out.println("MATCHES SIZE: " + matches.size());

        return ResponseEntity.ok(matches);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error fetching matches");
    }
}



}