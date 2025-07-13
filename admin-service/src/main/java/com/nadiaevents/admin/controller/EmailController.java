package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestBody Map<String, String> request) {
        try {
            logger.info("Received email test request: {}", request);
            
            String subject = request.get("subject");
            String message = request.get("message");
            
            if (subject == null || message == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Subject and message are required"
                ));
            }
            
            logger.info("Sending test email - Subject: {}, Message: {}", subject, message);
            
            emailService.sendAdminNotification(subject, message);
            
            logger.info("Test email sent successfully");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de test envoyé à Nadine"
            ));
        } catch (Exception e) {
            logger.error("Error sending test email", e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> emailStatus() {
        try {
            logger.info("Checking email service status");
            return ResponseEntity.ok(Map.of(
                "enabled", true,
                "from", "nadiaeventsdecor@gmail.com",
                "to", "nadiaeventsdecor@gmail.com",
                "service", "EmailService is available"
            ));
        } catch (Exception e) {
            logger.error("Error checking email status", e);
            return ResponseEntity.status(500).body(Map.of(
                "enabled", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "EmailController",
            "timestamp", System.currentTimeMillis()
        ));
    }
} 