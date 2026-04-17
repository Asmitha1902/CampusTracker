package com.campus.portal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campus.portal.entity.Admin;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}