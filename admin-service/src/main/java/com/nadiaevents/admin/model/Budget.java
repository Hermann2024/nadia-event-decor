package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "budget_name", nullable = false)
    private String budgetName;
    
    @Column(name = "budget_year", nullable = false)
    private Integer budgetYear;
    
    @Column(name = "budget_month")
    private Integer budgetMonth;
    
    @Enumerated(EnumType.STRING)
    private BudgetCategory category;
    
    @Column(name = "allocated_amount", nullable = false)
    private BigDecimal allocatedAmount;
    
    @Column(name = "spent_amount")
    private BigDecimal spentAmount;
    
    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount;
    
    @Enumerated(EnumType.STRING)
    private BudgetStatus status;
    
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum BudgetCategory {
        SALARIES, MARKETING, OPERATIONS, MAINTENANCE, 
        TECHNOLOGY, TRAVEL, TRAINING, OTHER
    }
    
    public enum BudgetStatus {
        ACTIVE, INACTIVE, EXCEEDED, COMPLETED
    }
    
    // Constructors
    public Budget() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = BudgetStatus.ACTIVE;
        this.spentAmount = BigDecimal.ZERO;
        this.remainingAmount = BigDecimal.ZERO;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBudgetName() {
        return budgetName;
    }
    
    public void setBudgetName(String budgetName) {
        this.budgetName = budgetName;
    }
    
    public Integer getBudgetYear() {
        return budgetYear;
    }
    
    public void setBudgetYear(Integer budgetYear) {
        this.budgetYear = budgetYear;
    }
    
    public Integer getBudgetMonth() {
        return budgetMonth;
    }
    
    public void setBudgetMonth(Integer budgetMonth) {
        this.budgetMonth = budgetMonth;
    }
    
    public BudgetCategory getCategory() {
        return category;
    }
    
    public void setCategory(BudgetCategory category) {
        this.category = category;
    }
    
    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }
    
    public void setAllocatedAmount(BigDecimal allocatedAmount) {
        this.allocatedAmount = allocatedAmount;
    }
    
    public BigDecimal getSpentAmount() {
        return spentAmount;
    }
    
    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }
    
    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }
    
    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }
    
    public BudgetStatus getStatus() {
        return status;
    }
    
    public void setStatus(BudgetStatus status) {
        this.status = status;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 