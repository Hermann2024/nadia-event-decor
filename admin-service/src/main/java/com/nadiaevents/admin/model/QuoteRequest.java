package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quote_requests")
public class QuoteRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "request_number", unique = true, nullable = false)
    private String requestNumber;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(name = "client_email", nullable = false)
    private String clientEmail;
    
    @Column(name = "client_phone")
    private String clientPhone;
    
    @Column(name = "event_date")
    private LocalDateTime eventDate;
    
    @Column(name = "event_type")
    private String eventType;
    
    @Column(name = "event_location")
    private String eventLocation;
    
    @Column(name = "guest_count")
    private Integer guestCount;
    
    @Column(name = "budget_range")
    private String budgetRange;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    private QuoteRequestStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private Staff assignedTo;
    
    @Column(name = "priority")
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(name = "estimated_completion_date")
    private LocalDateTime estimatedCompletionDate;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum QuoteRequestStatus {
        NEW, ASSIGNED, IN_PROGRESS, QUOTE_PREPARED, SENT, ACCEPTED, REJECTED, CANCELLED
    }
    
    // Constructors
    public QuoteRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = QuoteRequestStatus.NEW;
        this.priority = "MEDIUM";
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getRequestNumber() {
        return requestNumber;
    }
    
    public void setRequestNumber(String requestNumber) {
        this.requestNumber = requestNumber;
    }
    
    public String getClientName() {
        return clientName;
    }
    
    public void setClientName(String clientName) {
        this.clientName = clientName;
    }
    
    public String getClientEmail() {
        return clientEmail;
    }
    
    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }
    
    public String getClientPhone() {
        return clientPhone;
    }
    
    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }
    
    public LocalDateTime getEventDate() {
        return eventDate;
    }
    
    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }
    
    public String getEventType() {
        return eventType;
    }
    
    public void setEventType(String eventType) {
        this.eventType = eventType;
    }
    
    public String getEventLocation() {
        return eventLocation;
    }
    
    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }
    
    public Integer getGuestCount() {
        return guestCount;
    }
    
    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }
    
    public String getBudgetRange() {
        return budgetRange;
    }
    
    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public QuoteRequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(QuoteRequestStatus status) {
        this.status = status;
    }
    
    public Staff getAssignedTo() {
        return assignedTo;
    }
    
    public void setAssignedTo(Staff assignedTo) {
        this.assignedTo = assignedTo;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public LocalDateTime getEstimatedCompletionDate() {
        return estimatedCompletionDate;
    }
    
    public void setEstimatedCompletionDate(LocalDateTime estimatedCompletionDate) {
        this.estimatedCompletionDate = estimatedCompletionDate;
    }
    
    public LocalDateTime getCompletedDate() {
        return completedDate;
    }
    
    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
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