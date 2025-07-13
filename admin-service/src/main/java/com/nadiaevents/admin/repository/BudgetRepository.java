package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByBudgetYear(Integer year);
    
    List<Budget> findByCategory(Budget.BudgetCategory category);
    
    List<Budget> findByStatus(Budget.BudgetStatus status);
    
    @Query("SELECT b FROM Budget b WHERE b.budgetYear = :year AND b.budgetMonth = :month")
    List<Budget> findByYearAndMonth(@Param("year") Integer year, @Param("month") Integer month);
    
    @Query("SELECT SUM(b.allocatedAmount) FROM Budget b WHERE b.budgetYear = :year")
    BigDecimal getTotalBudgetByYear(@Param("year") Integer year);
    
    @Query("SELECT SUM(b.spentAmount) FROM Budget b WHERE b.budgetYear = :year")
    BigDecimal getTotalSpentByYear(@Param("year") Integer year);
    
    @Query("SELECT b.category, SUM(b.allocatedAmount), SUM(b.spentAmount) FROM Budget b WHERE b.budgetYear = :year GROUP BY b.category")
    List<Object[]> getBudgetSummaryByCategory(@Param("year") Integer year);
    
    @Query("SELECT b FROM Budget b WHERE b.spentAmount > b.allocatedAmount")
    List<Budget> findExceededBudgets();
    
    @Query("SELECT b FROM Budget b WHERE " +
           "LOWER(b.budgetName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Budget> searchBudgets(@Param("query") String query);
} 