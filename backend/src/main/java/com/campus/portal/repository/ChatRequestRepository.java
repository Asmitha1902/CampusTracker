package com.campus.portal.repository;

import com.campus.portal.entity.ChatRequest;
import com.campus.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRequestRepository extends JpaRepository<ChatRequest, Long> {
    List<ChatRequest> findBySenderOrReceiverOrderByCreatedAtDesc(User sender, User receiver);
    List<ChatRequest> findByReceiverAndStatusOrderByCreatedAtDesc(User receiver, String status);
    Optional<ChatRequest> findBySenderIdAndReceiverIdAndItemId(Long senderId, Long receiverId, Long itemId);
}
