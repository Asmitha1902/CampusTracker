package com.campus.portal.service;

import com.campus.portal.dto.ChatMessageDTO;
import com.campus.portal.dto.ChatRequestDTO;
import com.campus.portal.entity.ChatMessage;
import com.campus.portal.entity.ChatRequest;
import com.campus.portal.entity.Item;
import com.campus.portal.entity.User;
import com.campus.portal.repository.ChatMessageRepository;
import com.campus.portal.repository.ChatRequestRepository;
import com.campus.portal.repository.ItemRepository;
import com.campus.portal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatRequestRepository chatRequestRepo;
    private final ChatMessageRepository chatMessageRepo;
    private final UserRepository userRepo;
    private final ItemRepository itemRepo;

    public ChatService(ChatRequestRepository chatRequestRepo, ChatMessageRepository chatMessageRepo, UserRepository userRepo, ItemRepository itemRepo) {
        this.chatRequestRepo = chatRequestRepo;
        this.chatMessageRepo = chatMessageRepo;
        this.userRepo = userRepo;
        this.itemRepo = itemRepo;
    }

    public ChatRequestDTO createChatRequest(Long senderId, Long receiverId, Long itemId) {
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("You cannot send a chat request to yourself.");
        }
        User sender = userRepo.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepo.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));
        Item item = itemRepo.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));

        Optional<ChatRequest> existingReq = chatRequestRepo.findBySenderIdAndReceiverIdAndItemId(senderId, receiverId, itemId);
        if (existingReq.isPresent()) {
            return new ChatRequestDTO(existingReq.get());
        }

        ChatRequest request = new ChatRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setItem(item);
        request.setStatus("PENDING");

        return new ChatRequestDTO(chatRequestRepo.save(request));
    }

    public ChatRequestDTO updateRequestStatus(Long requestId, String status) {
        ChatRequest req = chatRequestRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(status.toUpperCase());
        return new ChatRequestDTO(chatRequestRepo.save(req));
    }

    public List<ChatRequestDTO> getUserChatRequests(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return chatRequestRepo.findBySenderOrReceiverOrderByCreatedAtDesc(user, user)
                .stream().map(ChatRequestDTO::new).collect(Collectors.toList());
    }

    public ChatMessageDTO sendMessage(Long requestId, Long senderId, String content) {
        ChatRequest req = chatRequestRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!"ACCEPTED".equalsIgnoreCase(req.getStatus())) {
            throw new RuntimeException("Cannot send message. Request not accepted.");
        }

        User sender = userRepo.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        
        ChatMessage msg = new ChatMessage();
        msg.setChatRequest(req);
        msg.setSender(sender);
        msg.setContent(content);

        return new ChatMessageDTO(chatMessageRepo.save(msg));
    }

    public List<ChatMessageDTO> getMessages(Long requestId) {
        return chatMessageRepo.findByChatRequestIdOrderByTimestampAsc(requestId)
                .stream().map(ChatMessageDTO::new).collect(Collectors.toList());
    }
}
