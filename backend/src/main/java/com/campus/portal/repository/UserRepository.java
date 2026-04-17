package com.campus.portal.repository;

import com.campus.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;        // ✅ ADD THIS
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // 🔍 Search by fullName
    List<User> findByFullNameContainingIgnoreCase(String name);
}