package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.AccountingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountingTransactionRepository extends JpaRepository<AccountingTransaction, Long> {
    
    Optional<AccountingTransaction> findByTransactionNumber(String transactionNumber);
    
    List<AccountingTransaction> findByType(AccountingTransaction.TransactionType type);
    
    List<AccountingTransaction> findByCategory(AccountingTransaction.TransactionCategory category);
    
    List<AccountingTransaction> findByStatus(AccountingTransaction.TransactionStatus status);
    
    List<AccountingTransaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<AccountingTransaction> findTop5ByOrderByTransactionDateDesc();
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM AccountingTransaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED'")
    BigDecimal getTotalIncome();
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM AccountingTransaction t WHERE t.type = 'EXPENSE' AND t.status = 'COMPLETED'")
    BigDecimal getTotalExpenses();
    
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM AccountingTransaction t WHERE t.type = 'EXPENSE' AND t.status = 'COMPLETED' GROUP BY t.category")
    List<Object[]> getExpensesByCategory();
    
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM AccountingTransaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED' GROUP BY t.category")
    List<Object[]> getIncomeByCategory();
    
    // Requêtes simplifiées pour éviter les problèmes avec les fonctions de date
    @Query("SELECT t FROM AccountingTransaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED' AND EXTRACT(YEAR FROM t.transactionDate) = ?1")
    List<AccountingTransaction> getIncomeTransactionsByYear(int year);
    
    @Query("SELECT t FROM AccountingTransaction t WHERE t.type = 'EXPENSE' AND t.status = 'COMPLETED' AND EXTRACT(YEAR FROM t.transactionDate) = ?1")
    List<AccountingTransaction> getExpenseTransactionsByYear(int year);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM AccountingTransaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalIncomeByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM AccountingTransaction t WHERE t.type = 'EXPENSE' AND t.status = 'COMPLETED' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpensesByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM AccountingTransaction t WHERE " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.transactionNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.category.name()) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.type.name()) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<AccountingTransaction> searchTransactions(@Param("query") String query);

    @Query("SELECT COUNT(t) FROM AccountingTransaction t WHERE t.createdAt >= ?1")
    Long countByCreatedAtAfter(LocalDateTime date);
} 