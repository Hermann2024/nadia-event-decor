package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            System.out.println("=== DEBUG: Appel de dashboardService.getDashboardStats() ===");
            Map<String, Object> stats = dashboardService.getDashboardStats();
            System.out.println("=== DEBUG: Succès de dashboardService.getDashboardStats() ===");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("=== DEBUG: Erreur dans getDashboardStats ===");
            System.err.println("Erreur: " + e.getMessage());
            e.printStackTrace();
            
            // Retourner l'erreur au lieu des données de fallback
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("exception", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/stats-fallback")
    public ResponseEntity<Map<String, Object>> getDashboardStatsFallback() {
        Map<String, Object> stats = new HashMap<>();
        
        Map<String, Object> events = new HashMap<>();
        events.put("count", 15);
        events.put("change", 5);
        
        Map<String, Object> products = new HashMap<>();
        products.put("count", 45);
        products.put("change", 12);
        
        Map<String, Object> staff = new HashMap<>();
        staff.put("count", 8);
        staff.put("change", 3);
        
        Map<String, Object> revenue = new HashMap<>();
        revenue.put("amount", 2500000);
        revenue.put("change", 8);
        
        stats.put("events", events);
        stats.put("products", products);
        stats.put("staff", staff);
        stats.put("revenue", revenue);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/recent-invoices")
    public ResponseEntity<?> getRecentInvoices() {
        try {
            return ResponseEntity.ok(dashboardService.getRecentActivity().get("recentInvoices"));
        } catch (Exception e) {
            System.err.println("Erreur dans getRecentInvoices: " + e.getMessage());
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    @GetMapping("/recent-quotes")
    public ResponseEntity<?> getRecentQuotes() {
        try {
            return ResponseEntity.ok(dashboardService.getRecentActivity().get("recentQuotes"));
        } catch (Exception e) {
            System.err.println("Erreur dans getRecentQuotes: " + e.getMessage());
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
    
    // Endpoint de test simple
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Admin service is working!");
    }
} 