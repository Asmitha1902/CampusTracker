package com.campus.portal.service;

import org.springframework.stereotype.Service;
import com.campus.portal.repository.AdminRepository;
import com.campus.portal.entity.Admin;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository repo;

    public AdminService(AdminRepository repo) {
        this.repo = repo;
    }

    public String login(String email, String password) {

        // 🔹 find admin by email
        Optional<Admin> optionalAdmin = repo.findByEmail(email);

        if (optionalAdmin.isEmpty()) {
            return "Invalid credentials";
        }

        Admin admin = optionalAdmin.get();

        // 🔹 check password
        if (!admin.getPassword().equals(password)) {
            return "Invalid credentials";
        }

        return "SUCCESS";
    }
}