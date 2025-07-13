package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.Budget;
import com.nadiaevents.admin.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/budgets")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class BudgetController {
    
    @Autowired
    private BudgetService budgetService;
    
    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        List<Budget> budgets = budgetService.getAllBudgets();
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget budget) {
        try {
            Budget savedBudget = budgetService.createBudget(budget);
            return ResponseEntity.ok(savedBudget);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @RequestBody Budget budget) {
        try {
            Budget updatedBudget = budgetService.updateBudget(id, budget);
            return ResponseEntity.ok(updatedBudget);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        try {
            budgetService.deleteBudget(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/year/{year}")
    public ResponseEntity<List<Budget>> getBudgetsByYear(@PathVariable Integer year) {
        List<Budget> budgets = budgetService.getBudgetsByYear(year);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Budget>> getBudgetsByCategory(@PathVariable Budget.BudgetCategory category) {
        List<Budget> budgets = budgetService.getBudgetsByCategory(category);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Budget>> getBudgetsByStatus(@PathVariable Budget.BudgetStatus status) {
        List<Budget> budgets = budgetService.getBudgetsByStatus(status);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/exceeded")
    public ResponseEntity<List<Budget>> getExceededBudgets() {
        List<Budget> budgets = budgetService.getExceededBudgets();
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/stats/{year}")
    public ResponseEntity<Map<String, Object>> getBudgetStats(@PathVariable Integer year) {
        Map<String, Object> stats = budgetService.getBudgetStats(year);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Object>> getBudgetSummary() {
        Map<String, Object> summary = budgetService.getBudgetSummary();
        return ResponseEntity.ok(summary);
    }
    
    @PutMapping("/{id}/spending")
    public ResponseEntity<?> updateBudgetSpending(@PathVariable Long id, @RequestParam BigDecimal amount) {
        try {
            Budget updatedBudget = budgetService.updateBudgetSpending(id, amount);
            return ResponseEntity.ok(updatedBudget);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Budget>> searchBudgets(@RequestParam String query) {
        List<Budget> budgets = budgetService.searchBudgets(query);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllBudgetCategories() {
        List<String> categories = List.of(
            "SALARIES", "MARKETING", "OPERATIONS", "MAINTENANCE",
            "TECHNOLOGY", "TRAVEL", "TRAINING", "OTHER"
        );
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllBudgetStatuses() {
        List<String> statuses = List.of("ACTIVE", "INACTIVE", "EXCEEDED", "COMPLETED");
        return ResponseEntity.ok(statuses);
    }
} 