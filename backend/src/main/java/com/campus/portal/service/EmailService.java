package com.campus.portal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Campus Portal - Email Verification OTP");
        message.setText(
                "Hello,\n\n" +
                "Your OTP for email verification is: " + otp +
                "\n\nThis OTP is valid for 5 minutes.\n\n" +
                "Thank You."
        );

        mailSender.send(message);
    }
}