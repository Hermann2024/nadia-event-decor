package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.Budget;
import com.nadiaevents.admin.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }
    
    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }
    
    public Budget createBudget(Budget budget) {
        validateBudget(budget);
        
        budget.setCreatedAt(java.time.LocalDateTime.now());
        budget.setUpdatedAt(java.time.LocalDateTime.now());
        budget.setStatus(Budget.BudgetStatus.ACTIVE);
        budget.setSpentAmount(BigDecimal.ZERO);
        budget.setRemainingAmount(budget.getAllocatedAmount());
        
        return budgetRepository.save(budget);
    }
    
    public Budget updateBudget(Long id, Budget budget) {
        Optional<Budget> existingBudget = budgetRepository.findById(id);
        if (existingBudget.isEmpty()) {
            throw new RuntimeException("Budget not found with id: " + id);
        }
        
        validateBudget(budget);
        
        budget.setId(id);
        budget.setUpdatedAt(java.time.LocalDateTime.now());
        budget.setCreatedAt(existingBudget.get().getCreatedAt());
        
        // Recalculer le montant restant
        budget.setRemainingAmount(budget.getAllocatedAmount().subtract(budget.getSpentAmount()));
        
        // Mettre à jour le statut si nécessaire
        if (budget.getSpentAmount().compareTo(budget.getAllocatedAmount()) > 0) {
            budget.setStatus(Budget.BudgetStatus.EXCEEDED);
        }
        
        return budgetRepository.save(budget);
    }
    
    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new RuntimeException("Budget not found with id: " + id);
        }
        budgetRepository.deleteById(id);
    }
    
    public List<Budget> getBudgetsByYear(Integer year) {
        return budgetRepository.findByBudgetYear(year);
    }
    
    public List<Budget> getBudgetsByCategory(Budget.BudgetCategory category) {
        return budgetRepository.findByCategory(category);
    }
    
    public List<Budget> getBudgetsByStatus(Budget.BudgetStatus status) {
        return budgetRepository.findByStatus(status);
    }
    
    public List<Budget> getExceededBudgets() {
        return budgetRepository.findExceededBudgets();
    }
    
    public Map<String, Object> getBudgetStats(Integer year) {
        BigDecimal totalBudget = budgetRepository.getTotalBudgetByYear(year);
        BigDecimal totalSpent = budgetRepository.getTotalSpentByYear(year);
        List<Object[]> byCategory = budgetRepository.getBudgetSummaryByCategory(year);
        
        BigDecimal remainingBudget = totalBudget != null ? totalBudget.subtract(totalSpent != null ? totalSpent : BigDecimal.ZERO) : BigDecimal.ZERO;
        
        return Map.of(
            "totalBudget", totalBudget != null ? totalBudget : BigDecimal.ZERO,
            "totalSpent", totalSpent != null ? totalSpent : BigDecimal.ZERO,
            "remainingBudget", remainingBudget,
            "byCategory", byCategory,
            "year", year
        );
    }
    
    public Map<String, Object> getBudgetSummary() {
        Integer currentYear = java.time.LocalDateTime.now().getYear();
        BigDecimal totalBudget = budgetRepository.getTotalBudgetByYear(currentYear);
        BigDecimal totalSpent = budgetRepository.getTotalSpentByYear(currentYear);
        List<Budget> exceededBudgets = budgetRepository.findExceededBudgets();
        
        return Map.of(
            "currentYear", currentYear,
            "totalBudget", totalBudget != null ? totalBudget : BigDecimal.ZERO,
            "totalSpent", totalSpent != null ? totalSpent : BigDecimal.ZERO,
            "exceededBudgets", exceededBudgets.size()
        );
    }
    
    public List<Budget> searchBudgets(String query) {
        return budgetRepository.searchBudgets(query);
    }
    
    public Budget updateBudgetSpending(Long budgetId, BigDecimal amount) {
        Optional<Budget> budget = budgetRepository.findById(budgetId);
        if (budget.isEmpty()) {
            throw new RuntimeException("Budget not found with id: " + budgetId);
        }
        
        Budget b = budget.get();
        b.setSpentAmount(b.getSpentAmount().add(amount));
        b.setRemainingAmount(b.getAllocatedAmount().subtract(b.getSpentAmount()));
        b.setUpdatedAt(java.time.LocalDateTime.now());
        
        // Mettre à jour le statut si nécessaire
        if (b.getSpentAmount().compareTo(b.getAllocatedAmount()) > 0) {
            b.setStatus(Budget.BudgetStatus.EXCEEDED);
        }
        
        return budgetRepository.save(b);
    }
    
    private void validateBudget(Budget budget) {
        if (budget.getBudgetName() == null || budget.getBudgetName().trim().isEmpty()) {
            throw new RuntimeException("Budget name is required");
        }
        if (budget.getBudgetYear() == null) {
            throw new RuntimeException("Budget year is required");
        }
        if (budget.getAllocatedAmount() == null || budget.getAllocatedAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Allocated amount must be greater than 0");
        }
        if (budget.getCategory() == null) {
            throw new RuntimeException("Budget category is required");
        }
    }
} 