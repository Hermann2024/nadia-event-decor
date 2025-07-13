package com.nadiaevents.admin.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    
    // ⚠️ SIMPLE : Stockage en mémoire (à remplacer par une base de données)
    private static final Map<String, String> VALID_USERS = new HashMap<>();
    private static final Map<String, String> ACTIVE_TOKENS = new HashMap<>();
    
    static {
        VALID_USERS.put("admin", "admin123");
        VALID_USERS.put("manager", "manager123");
        VALID_USERS.put("nadia", "nadia2024");
    }
    
    public String authenticate(String username, String password) {
        if (VALID_USERS.containsKey(username) && VALID_USERS.get(username).equals(password)) {
            String token = generateToken(username);
            ACTIVE_TOKENS.put(token, username);
            return token;
        }
        throw new RuntimeException("Identifiants incorrects");
    }
    
    public boolean validateToken(String token) {
        return ACTIVE_TOKENS.containsKey(token);
    }
    
    public String getUsernameFromToken(String token) {
        return ACTIVE_TOKENS.get(token);
    }
    
    public void logout(String token) {
        ACTIVE_TOKENS.remove(token);
    }
    
    private String generateToken(String username) {
        return "token_" + username + "_" + UUID.randomUUID().toString();
    }
} 