package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounting_transactions")
public class AccountingTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_number", unique = true, nullable = false)
    private String transactionNumber;
    
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
    
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
    
    @Column(name = "description", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TransactionCategory category;
    
    @Column(name = "reference_number")
    private String referenceNumber;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "related_invoice_id")
    private Long relatedInvoiceId;
    
    @Column(name = "related_quote_id")
    private Long relatedQuoteId;
    
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum TransactionType {
        INCOME, EXPENSE, TRANSFER
    }
    
    public enum TransactionCategory {
        SALES, PURCHASES, SALARY, RENT, UTILITIES, MARKETING, INSURANCE, MAINTENANCE, OTHER
    }
    
    public enum TransactionStatus {
        PENDING, COMPLETED, CANCELLED, FAILED
    }
    
    // Constructors
    public AccountingTransaction() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = TransactionStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTransactionNumber() {
        return transactionNumber;
    }
    
    public void setTransactionNumber(String transactionNumber) {
        this.transactionNumber = transactionNumber;
    }
    
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public TransactionType getType() {
        return type;
    }
    
    public void setType(TransactionType type) {
        this.type = type;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public TransactionCategory getCategory() {
        return category;
    }
    
    public void setCategory(TransactionCategory category) {
        this.category = category;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public Long getRelatedInvoiceId() {
        return relatedInvoiceId;
    }
    
    public void setRelatedInvoiceId(Long relatedInvoiceId) {
        this.relatedInvoiceId = relatedInvoiceId;
    }
    
    public Long getRelatedQuoteId() {
        return relatedQuoteId;
    }
    
    public void setRelatedQuoteId(Long relatedQuoteId) {
        this.relatedQuoteId = relatedQuoteId;
    }
    
    public TransactionStatus getStatus() {
        return status;
    }
    
    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
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