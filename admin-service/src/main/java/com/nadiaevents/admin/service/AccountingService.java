package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.AccountingTransaction;
import com.nadiaevents.admin.repository.AccountingTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountingService {
    
    @Autowired
    private AccountingTransactionRepository accountingRepository;
    
    public List<AccountingTransaction> getAllTransactions() {
        return accountingRepository.findAll();
    }
    
    public Optional<AccountingTransaction> getTransactionById(Long id) {
        return accountingRepository.findById(id);
    }
    
    public AccountingTransaction createTransaction(AccountingTransaction transaction) {
        // Validation des données
        validateTransactionData(transaction);
        
        // Initialisation des champs par défaut
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(LocalDateTime.now());
        }
        if (transaction.getStatus() == null) {
            transaction.setStatus(AccountingTransaction.TransactionStatus.PENDING);
        }
        
        // Générer un numéro de transaction unique
        if (transaction.getTransactionNumber() == null || transaction.getTransactionNumber().isEmpty()) {
            transaction.setTransactionNumber(generateTransactionNumber());
        }
        
        return accountingRepository.save(transaction);
    }
    
    public AccountingTransaction updateTransaction(Long id, AccountingTransaction transaction) {
        Optional<AccountingTransaction> existingTransaction = accountingRepository.findById(id);
        if (existingTransaction.isEmpty()) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        
        // Validation des données
        validateTransactionData(transaction);
        
        // Mise à jour des champs
        transaction.setId(id);
        transaction.setUpdatedAt(LocalDateTime.now());
        transaction.setCreatedAt(existingTransaction.get().getCreatedAt());
        
        return accountingRepository.save(transaction);
    }
    
    public void deleteTransaction(Long id) {
        if (!accountingRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        accountingRepository.deleteById(id);
    }
    
    public List<AccountingTransaction> getTransactionsByType(AccountingTransaction.TransactionType type) {
        return accountingRepository.findByType(type);
    }
    
    public List<AccountingTransaction> getTransactionsByCategory(AccountingTransaction.TransactionCategory category) {
        return accountingRepository.findByCategory(category);
    }
    
    public List<AccountingTransaction> getTransactionsByStatus(AccountingTransaction.TransactionStatus status) {
        return accountingRepository.findByStatus(status);
    }
    
    public List<AccountingTransaction> getRecentTransactions() {
        return accountingRepository.findTop5ByOrderByTransactionDateDesc();
    }
    
    public List<AccountingTransaction> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return accountingRepository.findByTransactionDateBetween(startDate, endDate);
    }
    
    public Map<String, Object> getAccountingStats() {
        try {
            var totalIncome = accountingRepository.getTotalIncome();
            var totalExpenses = accountingRepository.getTotalExpenses();
            
            var netProfit = (totalIncome != null ? totalIncome : BigDecimal.ZERO)
                    .subtract(totalExpenses != null ? totalExpenses : BigDecimal.ZERO);
            
            return Map.of(
                "totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO,
                "totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO,
                "netProfit", netProfit,
                "expensesByCategory", getExpensesByCategoryMap(),
                "incomeByCategory", getIncomeByCategoryMap()
            );
        } catch (Exception e) {
            // Retourner des données par défaut en cas d'erreur
            return Map.of(
                "totalIncome", BigDecimal.ZERO,
                "totalExpenses", BigDecimal.ZERO,
                "netProfit", BigDecimal.ZERO,
                "expensesByCategory", Map.of(),
                "incomeByCategory", Map.of()
            );
        }
    }
    
    public Map<String, Object> getMonthlyStats(int year) {
        try {
            List<AccountingTransaction> incomeTransactions = accountingRepository.getIncomeTransactionsByYear(year);
            List<AccountingTransaction> expenseTransactions = accountingRepository.getExpenseTransactionsByYear(year);
            
            Map<Integer, BigDecimal> monthlyIncome = incomeTransactions.stream()
                .collect(Collectors.groupingBy(
                    t -> t.getTransactionDate().getMonthValue(),
                    Collectors.reducing(BigDecimal.ZERO, AccountingTransaction::getAmount, BigDecimal::add)
                ));
            
            Map<Integer, BigDecimal> monthlyExpenses = expenseTransactions.stream()
                .collect(Collectors.groupingBy(
                    t -> t.getTransactionDate().getMonthValue(),
                    Collectors.reducing(BigDecimal.ZERO, AccountingTransaction::getAmount, BigDecimal::add)
                ));
            
            return Map.of(
                "monthlyIncome", monthlyIncome,
                "monthlyExpenses", monthlyExpenses,
                "year", year
            );
        } catch (Exception e) {
            return Map.of(
                "monthlyIncome", Map.of(),
                "monthlyExpenses", Map.of(),
                "year", year
            );
        }
    }
    
    public Map<String, Object> getCurrentMonthStats() {
        try {
            YearMonth currentMonth = YearMonth.now();
            LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
            LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);
            
            var monthlyIncome = accountingRepository.getTotalIncomeByDateRange(startOfMonth, endOfMonth);
            var monthlyExpenses = accountingRepository.getTotalExpensesByDateRange(startOfMonth, endOfMonth);
            
            var netProfit = (monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO)
                    .subtract(monthlyExpenses != null ? monthlyExpenses : BigDecimal.ZERO);
            
            return Map.of(
                "monthlyIncome", monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO,
                "monthlyExpenses", monthlyExpenses != null ? monthlyExpenses : BigDecimal.ZERO,
                "netProfit", netProfit,
                "month", currentMonth.toString()
            );
        } catch (Exception e) {
            return Map.of(
                "monthlyIncome", BigDecimal.ZERO,
                "monthlyExpenses", BigDecimal.ZERO,
                "netProfit", BigDecimal.ZERO,
                "month", YearMonth.now().toString()
            );
        }
    }
    
    public Map<String, Object> getYearlyStats(int year) {
        try {
            LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0, 0);
            LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);
            
            var yearlyIncome = accountingRepository.getTotalIncomeByDateRange(startOfYear, endOfYear);
            var yearlyExpenses = accountingRepository.getTotalExpensesByDateRange(startOfYear, endOfYear);
            
            var netProfit = (yearlyIncome != null ? yearlyIncome : BigDecimal.ZERO)
                    .subtract(yearlyExpenses != null ? yearlyExpenses : BigDecimal.ZERO);
            
            return Map.of(
                "yearlyIncome", yearlyIncome != null ? yearlyIncome : BigDecimal.ZERO,
                "yearlyExpenses", yearlyExpenses != null ? yearlyExpenses : BigDecimal.ZERO,
                "netProfit", netProfit,
                "year", year
            );
        } catch (Exception e) {
            return Map.of(
                "yearlyIncome", BigDecimal.ZERO,
                "yearlyExpenses", BigDecimal.ZERO,
                "netProfit", BigDecimal.ZERO,
                "year", year
            );
        }
    }
    
    public Map<String, Object> getCashFlowAnalysis() {
        try {
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            LocalDateTime sixtyDaysAgo = LocalDateTime.now().minusDays(60);
            
            var currentMonthIncome = accountingRepository.getTotalIncomeByDateRange(thirtyDaysAgo, LocalDateTime.now());
            var previousMonthIncome = accountingRepository.getTotalIncomeByDateRange(sixtyDaysAgo, thirtyDaysAgo);
            
            var currentMonthExpenses = accountingRepository.getTotalExpensesByDateRange(thirtyDaysAgo, LocalDateTime.now());
            var previousMonthExpenses = accountingRepository.getTotalExpensesByDateRange(sixtyDaysAgo, thirtyDaysAgo);
            
            double incomeGrowth = previousMonthIncome != null && previousMonthIncome.compareTo(BigDecimal.ZERO) > 0 
                ? ((currentMonthIncome != null ? currentMonthIncome : BigDecimal.ZERO)
                    .subtract(previousMonthIncome).doubleValue() / previousMonthIncome.doubleValue()) * 100 
                : 0;
            
            double expenseGrowth = previousMonthExpenses != null && previousMonthExpenses.compareTo(BigDecimal.ZERO) > 0 
                ? ((currentMonthExpenses != null ? currentMonthExpenses : BigDecimal.ZERO)
                    .subtract(previousMonthExpenses).doubleValue() / previousMonthExpenses.doubleValue()) * 100 
                : 0;
            
            return Map.of(
                "currentMonthIncome", currentMonthIncome != null ? currentMonthIncome : BigDecimal.ZERO,
                "previousMonthIncome", previousMonthIncome != null ? previousMonthIncome : BigDecimal.ZERO,
                "incomeGrowth", incomeGrowth,
                "currentMonthExpenses", currentMonthExpenses != null ? currentMonthExpenses : BigDecimal.ZERO,
                "previousMonthExpenses", previousMonthExpenses != null ? previousMonthExpenses : BigDecimal.ZERO,
                "expenseGrowth", expenseGrowth
            );
        } catch (Exception e) {
            return Map.of(
                "currentMonthIncome", BigDecimal.ZERO,
                "previousMonthIncome", BigDecimal.ZERO,
                "incomeGrowth", 0.0,
                "currentMonthExpenses", BigDecimal.ZERO,
                "previousMonthExpenses", BigDecimal.ZERO,
                "expenseGrowth", 0.0
            );
        }
    }
    
    public List<AccountingTransaction> searchTransactions(String query) {
        return accountingRepository.searchTransactions(query);
    }
    
    public Map<String, Object> getBudgetAnalysis() {
        try {
            var totalExpenses = accountingRepository.getTotalExpenses();
            var totalIncome = accountingRepository.getTotalIncome();
            
            double expenseRatio = totalIncome != null && totalIncome.compareTo(BigDecimal.ZERO) > 0 
                ? (totalExpenses != null ? totalExpenses : BigDecimal.ZERO).doubleValue() / totalIncome.doubleValue() * 100 
                : 0;
            
            return Map.of(
                "totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO,
                "totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO,
                "expenseRatio", expenseRatio
            );
        } catch (Exception e) {
            return Map.of(
                "totalExpenses", BigDecimal.ZERO,
                "totalIncome", BigDecimal.ZERO,
                "expenseRatio", 0.0
            );
        }
    }
    
    public Map<String, Object> getFinancialHealthMetrics() {
        try {
            var totalIncome = accountingRepository.getTotalIncome();
            var totalExpenses = accountingRepository.getTotalExpenses();
            
            var netProfit = (totalIncome != null ? totalIncome : BigDecimal.ZERO)
                    .subtract(totalExpenses != null ? totalExpenses : BigDecimal.ZERO);
            
            double profitMargin = totalIncome != null && totalIncome.compareTo(BigDecimal.ZERO) > 0 
                ? netProfit.doubleValue() / totalIncome.doubleValue() * 100 : 0;
            
            return Map.of(
                "totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO,
                "totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO,
                "netProfit", netProfit,
                "profitMargin", profitMargin
            );
        } catch (Exception e) {
            return Map.of(
                "totalIncome", BigDecimal.ZERO,
                "totalExpenses", BigDecimal.ZERO,
                "netProfit", BigDecimal.ZERO,
                "profitMargin", 0.0
            );
        }
    }
    
    public Map<String, Object> getExpenseBreakdown() {
        try {
            var totalExpenses = accountingRepository.getTotalExpenses();
            
            return Map.of(
                "expensesByCategory", getExpensesByCategoryMap(),
                "totalExpenses", totalExpenses != null ? totalExpenses : BigDecimal.ZERO
            );
        } catch (Exception e) {
            return Map.of(
                "expensesByCategory", Map.of(),
                "totalExpenses", BigDecimal.ZERO
            );
        }
    }
    
    public Map<String, Object> getIncomeBreakdown() {
        try {
            var totalIncome = accountingRepository.getTotalIncome();
            
            return Map.of(
                "incomeByCategory", getIncomeByCategoryMap(),
                "totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO
            );
        } catch (Exception e) {
            return Map.of(
                "incomeByCategory", Map.of(),
                "totalIncome", BigDecimal.ZERO
            );
        }
    }
    
    private String generateTransactionNumber() {
        return "TXN-" + System.currentTimeMillis();
    }
    
    private void validateTransactionData(AccountingTransaction transaction) {
        // ⚠️ CORRECTION : Validation plus souple
        if (transaction.getDescription() == null || transaction.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Description is required");
        }
        
        // ⚠️ CORRECTION : Validation du montant plus souple
        if (transaction.getAmount() == null) {
            throw new RuntimeException("Amount is required");
        }
        
        // ⚠️ CORRECTION : Permettre les montants négatifs pour les dépenses
        if (transaction.getAmount().compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("Amount must not be zero");
        }
        
        if (transaction.getType() == null) {
            throw new RuntimeException("Transaction type is required");
        }
        
        // ⚠️ CORRECTION : Validation de la catégorie plus souple
        if (transaction.getCategory() == null) {
            // Définir une catégorie par défaut selon le type
            if (transaction.getType() == AccountingTransaction.TransactionType.INCOME) {
                transaction.setCategory(AccountingTransaction.TransactionCategory.SALES);
            } else if (transaction.getType() == AccountingTransaction.TransactionType.EXPENSE) {
                transaction.setCategory(AccountingTransaction.TransactionCategory.OTHER);
            }
        }
    }
    
    private Map<String, BigDecimal> getExpensesByCategoryMap() {
        try {
            List<Object[]> results = accountingRepository.getExpensesByCategory();
            return results.stream()
                .collect(Collectors.toMap(
                    row -> row[0].toString(),
                    row -> (BigDecimal) row[1]
                ));
        } catch (Exception e) {
            return Map.of();
        }
    }
    
    private Map<String, BigDecimal> getIncomeByCategoryMap() {
        try {
            List<Object[]> results = accountingRepository.getIncomeByCategory();
            return results.stream()
                .collect(Collectors.toMap(
                    row -> row[0].toString(),
                    row -> (BigDecimal) row[1]
                ));
        } catch (Exception e) {
            return Map.of();
        }
    }
} 