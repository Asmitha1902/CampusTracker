package com.campus.portal.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import com.campus.portal.dto.ReportDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.campus.portal.entity.Notification;
import com.campus.portal.repository.NotificationRepository;
import com.campus.portal.dto.ItemDTO;
import com.campus.portal.entity.Item;
import com.campus.portal.entity.User;
import com.campus.portal.repository.ItemRepository;
import com.campus.portal.repository.UserRepository;

@Service
public class ItemService {

    private final ItemRepository itemRepo;
    private final UserRepository userRepo;
    private final NotificationRepository notificationRepo; // make it final

    // ✅ Single constructor with all dependencies
    public ItemService(ItemRepository itemRepo, UserRepository userRepo, NotificationRepository notificationRepo) {
        this.itemRepo = itemRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
    }

    // ================= SAVE ITEM =================
    public Item save(Item item, MultipartFile image) throws IOException {

        // Default values
        if (item.getStatus() == null || item.getStatus().isEmpty()) {
            item.setStatus("PENDING");
        }

        if (item.getItemStatus() == null || item.getItemStatus().isEmpty()) {
            item.setItemStatus("ACTIVE");
        }

        // ================= IMAGE UPLOAD =================
        if (image != null && !image.isEmpty()) {

            String uploadDir = System.getProperty("user.dir") + "/uploads";

            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

            File dest = new File(uploadDir + "/" + fileName);
            image.transferTo(dest);

            item.setImagePath(fileName);
        }

        // Clean tags
        if (item.getTags() != null) {
            item.setTags(item.getTags().trim());
        }

        return itemRepo.save(item);
    }

    // ================= GET ALL =================
    public List<ItemDTO> getAllItemsDTO() {
        return itemRepo.findAllByOrderByIdDesc()
                .stream()
                .map(ItemDTO::new)
                .collect(Collectors.toList());
    }

    // ================= GET BY STATUS =================
    // ================= GET BY STATUS =================
    public List<ItemDTO> getItemsByStatusDTO(String status) {

        List<Item> items = itemRepo.findByStatusIgnoreCase(status);

        return items.stream()
                .map(ItemDTO::new)
                .collect(Collectors.toList());
    }

    // ================= GET ITEM BY ID =================
    public Item getItemById(Long id) {
        return itemRepo.findById(id).orElse(null);
    }

    // ================= APPROVE =================
    public void approveItem(Long id) {
        Item item = getItemById(id);

        if (item != null) {
            item.setStatus("APPROVED");

            if (item.getItemStatus() == null || item.getItemStatus().isEmpty()) {
                item.setItemStatus("ACTIVE");
            }

            itemRepo.save(item);
        }
    }

    // ================= REJECT =================
    public void rejectItem(Long id) {
        Item item = getItemById(id);

        if (item != null) {
            item.setStatus("REJECTED");
            itemRepo.save(item);
        }
    }

    // ================= UPDATE ITEM STATUS =================
    public void updateItemStatus(Long id, String itemStatus) {
        Item item = getItemById(id);

        if (item != null) {
            item.setItemStatus(itemStatus.toUpperCase());
            itemRepo.save(item);
        }
    }

    // ================= DELETE =================
    public void deleteItem(Long id) {
        itemRepo.deleteById(id);
    }

    // ================= COUNT =================
    public long getItemsCount() {
        return itemRepo.count();
    }

    // ================= GET USER BY EMAIL =================
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================= MY POSTS =================
    public List<ItemDTO> getItemsByUserId(Long userId) {

        List<Item> items = itemRepo.findByUser_Id(userId);

        return items.stream()
                .map(ItemDTO::new)
                .collect(Collectors.toList());
    }

    // ================= AUTO MATCH =================
    public List<ItemDTO> findMatchesForUser(Long userId) {

        List<Item> myItems = itemRepo.findByUser_Id(userId);
        List<Item> allItems = itemRepo.findAll();

        List<ItemDTO> matches = new ArrayList<>();
        Set<Long> shownIds = new HashSet<>();

        for (Item myItem : myItems) {

            if (myItem == null || myItem.getUser() == null)
                continue;

            String myType = myItem.getType() != null
                    ? myItem.getType().trim().toLowerCase()
                    : "";

            // 👉 ONLY LOST
            if (!myType.contains("lost"))
                continue;

            Item bestMatch = null;
            int bestScore = 0;

            for (Item other : allItems) {

                if (other == null || other.getUser() == null)
                    continue;

                if (other.getUser().getId().equals(userId))
                    continue;
                if (myItem.getId().equals(other.getId()))
                    continue;

                String otherType = other.getType() != null
                        ? other.getType().trim().toLowerCase()
                        : "";

                // 👉 ONLY FOUND
                if (!otherType.contains("found"))
                    continue;

                int score = 0;

                // ✅ NAME MATCH
                if (myItem.getItemName() != null && other.getItemName() != null) {
                    String n1 = myItem.getItemName().toLowerCase().replaceAll("\\s+", "");
                    String n2 = other.getItemName().toLowerCase().replaceAll("\\s+", "");

                    if (n1.equals(n2))
                        score += 60;
                    else if (n1.contains(n2) || n2.contains(n1))
                        score += 40;
                }

                // ✅ LOCATION MATCH
                if (myItem.getLocation() != null && other.getLocation() != null) {
                    if (myItem.getLocation().trim()
                            .equalsIgnoreCase(other.getLocation().trim())) {
                        score += 30;
                    }
                }

                // ✅ TAGS MATCH
                if (myItem.getTags() != null && other.getTags() != null) {
                    String[] t1 = myItem.getTags().toLowerCase().split(",");
                    String[] t2 = other.getTags().toLowerCase().split(",");

                    for (String a : t1) {
                        for (String b : t2) {
                            if (!a.trim().isEmpty() &&
                                    a.trim().equals(b.trim())) {
                                score += 10;
                            }
                        }
                    }
                }

                // 👉 BEST MATCH
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = other;
                }
            }

            // 🔥 SAVE MATCH + NOTIFICATION
            if (bestMatch != null && bestScore >= 30) {

                myItem.setItemStatus("MATCHED");
                bestMatch.setItemStatus("MATCHED");

                itemRepo.save(myItem);
                itemRepo.save(bestMatch);

                // ================= 🔔 NOTIFICATION =================
                // ================= 🔔 NOTIFICATION =================
                User myUser = myItem.getUser(); // LOST user
                User otherUser = bestMatch.getUser(); // FOUND user

                String itemName = myItem.getItemName();
                String location = myItem.getLocation();

                // 🔥 BETTER MESSAGES
                String msg1 = "Match found! Someone found your LOST item: " + itemName;
                String msg2 = "Good news! Someone claimed your FOUND item: " + itemName;

                // ✅ LOST USER NOTIFICATION
                if (!notificationRepo.existsByUserAndMessage(myUser, msg1)) {

                    Notification notification1 = new Notification(
                            myUser,
                            msg1,
                            "LOST",
                            itemName,
                            location,
                            otherUser.getFullName() // 👉 who found it
                    );

                    notificationRepo.save(notification1);
                }

                // ✅ FOUND USER NOTIFICATION
                if (!notificationRepo.existsByUserAndMessage(otherUser, msg2)) {

                    Notification notification2 = new Notification(
                            otherUser,
                            msg2,
                            "FOUND",
                            itemName,
                            location,
                            myUser.getFullName() // 👉 who claimed it
                    );

                    notificationRepo.save(notification2);
                }
                // ====================================================
                // ====================================================

                // 👉 RESPONSE ADD
                if (!shownIds.contains(bestMatch.getId())) {
                    shownIds.add(bestMatch.getId());

                    ItemDTO dto = new ItemDTO(bestMatch);
                    dto.setMatchPercent(bestScore);

                    matches.add(dto);
                }

            } else {
                myItem.setItemStatus("ACTIVE");
                itemRepo.save(myItem);
            }
        }

        // 🔥 OLD MATCHED ITEMS (NO FAKE 100%)
        for (Item item : allItems) {

            if (item.getItemStatus() != null &&
                    item.getItemStatus().equalsIgnoreCase("MATCHED")) {

                String type = item.getType() != null
                        ? item.getType().toLowerCase()
                        : "";

                if (!type.contains("found"))
                    continue;
                if (shownIds.contains(item.getId()))
                    continue;

                shownIds.add(item.getId());

                ItemDTO dto = new ItemDTO(item);

                // Optional fallback score
                dto.setMatchPercent(70);

                matches.add(dto);
            }
        }

        return matches;
    }

    public ReportDTO getReportData() {

        List<Item> items = itemRepo.findAll();

        ReportDTO dto = new ReportDTO();

        int lost = 0, found = 0, matched = 0, resolved = 0, pending = 0;

        Map<String, Long> categoryMap = new HashMap<>();
        Map<String, Long> monthlyLost = new HashMap<>();
        Map<String, Long> monthlyMatched = new HashMap<>();
        Map<String, Long> monthlyFound = new HashMap<>(); // ✅ FIX

        for (Item item : items) {

            // ✅ ONLY ADD THIS BLOCK (change here only)
            if ("PENDING".equalsIgnoreCase(item.getStatus())) {
                pending++;
                continue;
            }
            // 🔹 TYPE COUNT
            if ("lost".equalsIgnoreCase(item.getType())) {
                lost++;
            }

            if ("found".equalsIgnoreCase(item.getType())) {
                found++;
            }

            // 🔹 STATUS COUNT
            if ("MATCHED".equalsIgnoreCase(item.getItemStatus())) {
                matched++;
            }

            if ("RESOLVED".equalsIgnoreCase(item.getItemStatus())) {
                resolved++;
            }

            // 🔹 CATEGORY
            String cat = (item.getCategory() != null) ? item.getCategory() : "Others";
            categoryMap.put(cat, categoryMap.getOrDefault(cat, 0L) + 1);

            // 🔹 MONTHLY LOGIC
            if (item.getDate() != null) {

                String month = item.getDate().getMonth().toString();

                if ("lost".equalsIgnoreCase(item.getType())) {
                    monthlyLost.put(month,
                            monthlyLost.getOrDefault(month, 0L) + 1);
                }

                if ("found".equalsIgnoreCase(item.getType())) {
                    monthlyFound.put(month,
                            monthlyFound.getOrDefault(month, 0L) + 1);
                }

                if ("MATCHED".equalsIgnoreCase(item.getItemStatus())) {
                    monthlyMatched.put(month,
                            monthlyMatched.getOrDefault(month, 0L) + 1);
                }
            }
        }
        // 🔹 SET VALUES
        dto.setLost(lost);
        dto.setFound(found);
        dto.setMatched(matched);
        dto.setResolved(resolved);
        dto.setPending(pending); // ✅ VERY IMPORTANT

        dto.setCategoryData(categoryMap);
        dto.setMonthlyLost(monthlyLost);
        dto.setMonthlyMatched(monthlyMatched);
        dto.setMonthlyFound(monthlyFound); // ✅ IMPORTANT

        return dto;
    }

}