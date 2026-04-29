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

            // Skip if the item is already resolved
            if ("RESOLVED".equalsIgnoreCase(myItem.getItemStatus()))
                continue;

            String myType = myItem.getType() != null
                    ? myItem.getType().trim().toLowerCase()
                    : "";

            String targetType = "";
            if (myType.contains("lost")) {
                targetType = "found";
            } else if (myType.contains("found")) {
                targetType = "lost";
            } else {
                continue;
            }

            Item bestMatch = null;
            int bestScore = 0;

            for (Item other : allItems) {

                if (other == null || other.getUser() == null)
                    continue;

                if (other.getUser().getId().equals(userId))
                    continue;
                if (myItem.getId().equals(other.getId()))
                    continue;

                // Skip if the other item is already resolved
                if ("RESOLVED".equalsIgnoreCase(other.getItemStatus()))
                    continue;

                String otherType = other.getType() != null
                        ? other.getType().trim().toLowerCase()
                        : "";

                // 👉 MATCH AGAINST TARGET TYPE
                if (!otherType.contains(targetType))
                    continue;

                int score = 0;

                // ✅ NAME MATCH (FUZZY MATCHING)
                int nameMatchPercent = 0;
                if (myItem.getItemName() != null && other.getItemName() != null) {
                    String n1 = myItem.getItemName().toLowerCase().trim();
                    String n2 = other.getItemName().toLowerCase().trim();

                    nameMatchPercent = calculateFuzzyMatchPercentage(n1, n2);
                    if (n1.contains(n2) || n2.contains(n1)) {
                        nameMatchPercent = Math.max(nameMatchPercent, 80);
                    }
                }

                // ✅ LOCATION MATCH
                int locationMatchPercent = 0;
                if (myItem.getLocation() != null && other.getLocation() != null) {
                    if (myItem.getLocation().trim()
                            .equalsIgnoreCase(other.getLocation().trim())) {
                        locationMatchPercent = 100;
                    } else {
                        locationMatchPercent = calculateFuzzyMatchPercentage(
                                myItem.getLocation().toLowerCase().trim(),
                                other.getLocation().toLowerCase().trim());
                    }
                }

                // ✅ TAGS MATCH (FUZZY MATCHING)
                int tagsMatchPercent = 0;
                if (myItem.getTags() != null && other.getTags() != null) {
                    String[] t1 = myItem.getTags().toLowerCase().split(",");
                    String[] t2 = other.getTags().toLowerCase().split(",");

                    for (String a : t1) {
                        for (String b : t2) {
                            if (!a.trim().isEmpty() && !b.trim().isEmpty()) {
                                int tagMatchPercent = calculateFuzzyMatchPercentage(a.trim(), b.trim());
                                if (tagMatchPercent > tagsMatchPercent) {
                                    tagsMatchPercent = tagMatchPercent;
                                }
                            }
                        }
                    }
                }

                // Weighted Score: 60% Name, 30% Location, 10% Tags
                score = (int) ((nameMatchPercent * 0.6) + (locationMatchPercent * 0.3) + (tagsMatchPercent * 0.1));

                // 👉 BEST MATCH
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = other;
                }

                // 👉 ADD ALL EVALUATED ITEMS AS POTENTIAL MATCHES
                // We keep track of the max score achieved by an 'other' item against any of
                // 'myItems'
                if (other.getType() != null && other.getType().toLowerCase().contains("found")) {
                    ItemDTO dto = new ItemDTO(other);
                    dto.setMatchPercent(score);

                    // Check if it's already in the matches list, if so, update if score is higher
                    boolean foundInList = false;
                    for (ItemDTO existing : matches) {
                        if (existing.getId().equals(other.getId())) {
                            foundInList = true;
                            if (score > existing.getMatchPercent()) {
                                existing.setMatchPercent(score);
                            }
                            break;
                        }
                    }

                    if (!foundInList) {
                        matches.add(dto);
                        shownIds.add(other.getId());
                    }
                }
            }

            // 🔥 SAVE MATCH + NOTIFICATION
            if (bestMatch != null && bestScore >= 40) {

                if (!"MATCHED".equalsIgnoreCase(myItem.getItemStatus())) {
                    myItem.setItemStatus("MATCHED");
                    itemRepo.save(myItem);
                }

                if (!"MATCHED".equalsIgnoreCase(bestMatch.getItemStatus())) {
                    bestMatch.setItemStatus("MATCHED");
                    itemRepo.save(bestMatch);
                }

                // ================= 🔔 NOTIFICATION =================
                User myUser = myItem.getUser(); // the user who owns myItem
                User otherUser = bestMatch.getUser(); // the user who owns bestMatch

                String itemName = myItem.getItemName();
                String location = myItem.getLocation();

                String msg1 = "";
                String msg2 = "";

                if (myType.contains("lost")) {
                    msg1 = "Match found! Someone found your LOST item: " + itemName;
                    msg2 = "Good news! Someone claimed your FOUND item: " + bestMatch.getItemName();
                } else {
                    msg1 = "Good news! Someone claimed your FOUND item: " + itemName;
                    msg2 = "Match found! Someone found your LOST item: " + bestMatch.getItemName();
                }

                // ✅ MY USER NOTIFICATION
                if (!notificationRepo.existsByUserAndMessage(myUser, msg1)) {
                    Notification notification1 = new Notification(
                            myUser,
                            msg1,
                            myType.toUpperCase(),
                            itemName,
                            location,
                            otherUser.getFullName());
                    notificationRepo.save(notification1);
                }

                // ✅ OTHER USER NOTIFICATION
                if (!notificationRepo.existsByUserAndMessage(otherUser, msg2)) {
                    Notification notification2 = new Notification(
                            otherUser,
                            msg2,
                            targetType.toUpperCase(),
                            bestMatch.getItemName(),
                            bestMatch.getLocation(),
                            myUser.getFullName());
                    notificationRepo.save(notification2);
                }

            } else {
                if ("MATCHED".equalsIgnoreCase(myItem.getItemStatus())) {
                    myItem.setItemStatus("ACTIVE");
                    itemRepo.save(myItem);
                }
            }
        }

        // 🔥 OLD MATCHED ITEMS (SHOW TO ALL USERS)
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
                dto.setMatchPercent(100);

                matches.add(dto);
            }
        }

        // Sort matches by percentage descending
        matches.sort((a, b) -> Integer.compare(b.getMatchPercent(), a.getMatchPercent()));

        return matches;
    }

    // ================= FUZZY MATCH ALGORITHM (LEVENSHTEIN) =================
    private int calculateFuzzyMatchPercentage(String s1, String s2) {
        if (s1 == null || s2 == null)
            return 0;
        if (s1.equals(s2))
            return 100;

        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        int newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[s2.length()] = lastValue;
            }
        }

        int distance = costs[s2.length()];
        int maxLength = Math.max(s1.length(), s2.length());

        if (maxLength == 0)
            return 100;

        return (int) (((double) (maxLength - distance) / maxLength) * 100);
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