package com.nadiaevents.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "admin-service");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Admin Dashboard API is working!");
        response.put("service", "admin-service");
        response.put("version", "1.0.0");
        return response;
    }
} 