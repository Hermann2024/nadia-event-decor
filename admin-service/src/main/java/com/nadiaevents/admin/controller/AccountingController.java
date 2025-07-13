package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.AccountingTransaction;
import com.nadiaevents.admin.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/accounting")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class AccountingController {
    
    @Autowired
    private AccountingService accountingService;
    
    @GetMapping
    public ResponseEntity<List<AccountingTransaction>> getAllTransactions() {
        List<AccountingTransaction> transactions = accountingService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AccountingTransaction> getTransactionById(@PathVariable Long id) {
        return accountingService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody AccountingTransaction transaction) {
        try {
            // ⚠️ CORRECTION : Log des données reçues pour debug
            System.out.println("Données reçues: " + transaction);
            
            AccountingTransaction savedTransaction = accountingService.createTransaction(transaction);
            return ResponseEntity.ok(savedTransaction);
        } catch (RuntimeException e) {
            // ⚠️ CORRECTION : Log de l'erreur pour debug
            System.err.println("Erreur de validation: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "details", "Vérifiez que tous les champs obligatoires sont remplis"
            ));
        } catch (Exception e) {
            // ⚠️ CORRECTION : Gestion des autres erreurs
            System.err.println("Erreur inattendue: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Erreur inattendue lors de la création",
                "details", e.getMessage()
            ));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, @RequestBody AccountingTransaction transaction) {
        try {
            AccountingTransaction updatedTransaction = accountingService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updatedTransaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            accountingService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<AccountingTransaction>> getTransactionsByType(@PathVariable AccountingTransaction.TransactionType type) {
        List<AccountingTransaction> transactions = accountingService.getTransactionsByType(type);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<AccountingTransaction>> getTransactionsByCategory(@PathVariable AccountingTransaction.TransactionCategory category) {
        List<AccountingTransaction> transactions = accountingService.getTransactionsByCategory(category);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AccountingTransaction>> getTransactionsByStatus(@PathVariable AccountingTransaction.TransactionStatus status) {
        List<AccountingTransaction> transactions = accountingService.getTransactionsByStatus(status);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<AccountingTransaction>> getRecentTransactions() {
        List<AccountingTransaction> transactions = accountingService.getRecentTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<AccountingTransaction>> getTransactionsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<AccountingTransaction> transactions = accountingService.getTransactionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAccountingStats() {
        Map<String, Object> stats = accountingService.getAccountingStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/monthly/{year}")
    public ResponseEntity<Map<String, Object>> getMonthlyStats(@PathVariable int year) {
        Map<String, Object> stats = accountingService.getMonthlyStats(year);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/current-month")
    public ResponseEntity<Map<String, Object>> getCurrentMonthStats() {
        Map<String, Object> stats = accountingService.getCurrentMonthStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/yearly/{year}")
    public ResponseEntity<Map<String, Object>> getYearlyStats(@PathVariable int year) {
        Map<String, Object> stats = accountingService.getYearlyStats(year);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/cash-flow")
    public ResponseEntity<Map<String, Object>> getCashFlowAnalysis() {
        Map<String, Object> stats = accountingService.getCashFlowAnalysis();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/budget")
    public ResponseEntity<Map<String, Object>> getBudgetAnalysis() {
        Map<String, Object> stats = accountingService.getBudgetAnalysis();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/financial-health")
    public ResponseEntity<Map<String, Object>> getFinancialHealthMetrics() {
        Map<String, Object> metrics = accountingService.getFinancialHealthMetrics();
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/stats/expense-breakdown")
    public ResponseEntity<Map<String, Object>> getExpenseBreakdown() {
        Map<String, Object> breakdown = accountingService.getExpenseBreakdown();
        return ResponseEntity.ok(breakdown);
    }
    
    @GetMapping("/stats/income-breakdown")
    public ResponseEntity<Map<String, Object>> getIncomeBreakdown() {
        Map<String, Object> breakdown = accountingService.getIncomeBreakdown();
        return ResponseEntity.ok(breakdown);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<AccountingTransaction>> searchTransactions(@RequestParam String query) {
        List<AccountingTransaction> transactions = accountingService.searchTransactions(query);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = accountingService.getAllTransactions().stream()
                .map(transaction -> transaction.getCategory().name())
                .distinct()
                .toList();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllTypes() {
        List<String> types = accountingService.getAllTransactions().stream()
                .map(transaction -> transaction.getType().name())
                .distinct()
                .toList();
        return ResponseEntity.ok(types);
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllStatuses() {
        List<String> statuses = accountingService.getAllTransactions().stream()
                .map(transaction -> transaction.getStatus().name())
                .distinct()
                .toList();
        return ResponseEntity.ok(statuses);
    }
} 