package com.campus.portal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.campus.portal.service.AuthService;
import com.campus.portal.dto.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // ✅ FIX PORT
public class AuthController {

    private final AuthService authService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest request) {
        return authService.verifyOtp(request);
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        ResponseEntity<?> response = authService.login(request);

        if (!response.getStatusCode().is2xxSuccessful()) {
            return response;
        }

        Object body = response.getBody();

        if (body instanceof UserDTO userDTO) {

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userDTO.getEmail(),
                            null,
                            Collections.singletonList(
                                    new SimpleGrantedAuthority(userDTO.getRole())
                            )
                    );

            SecurityContextHolder.getContext().setAuthentication(auth);

            HttpSession session = httpRequest.getSession(true);

            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            session.setAttribute("userId", userDTO.getId());          // ✅ IMPORTANT
            session.setAttribute("userName", userDTO.getFullName());  // ✅ ADD

            System.out.println("SESSION CREATED: " + session.getId());

            return ResponseEntity.ok().body(
                new java.util.HashMap<String, Object>() {{
                    put("id", userDTO.getId());
                    put("fullName", userDTO.getFullName());
                    put("email", userDTO.getEmail());
                    put("message", "Login successful");
                }}
            );
        }

        return ResponseEntity.status(500).body("Unexpected error");
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}