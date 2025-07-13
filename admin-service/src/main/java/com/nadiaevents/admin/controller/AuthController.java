package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.LoginRequest;
import com.nadiaevents.admin.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.authenticate(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", request.getUsername(),
                "message", "Connexion réussie"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        try {
            // Extraire le token du header "Bearer token"
            String actualToken = token.replace("Bearer ", "");
            authService.logout(actualToken);
            return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de la déconnexion"));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String actualToken = token.replace("Bearer ", "");
            boolean isValid = authService.validateToken(actualToken);
            
            if (isValid) {
                String username = authService.getUsernameFromToken(actualToken);
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "username", username
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("valid", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("valid", false));
        }
    }
} 