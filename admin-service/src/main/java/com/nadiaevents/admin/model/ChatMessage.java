package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_id", nullable = false)
    private String sessionId;
    
    @Column(name = "sender_name", nullable = false)
    private String senderName;
    
    @Column(name = "sender_email")
    private String senderEmail;
    
    @Column(name = "sender_phone")
    private String senderPhone;
    
    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Enumerated(EnumType.STRING)
    private MessageType type;
    
    @Enumerated(EnumType.STRING)
    private MessageStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    private Staff assignedStaff;
    
    @Column(name = "is_from_visitor", nullable = false)
    private Boolean isFromVisitor;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    public enum MessageType {
        TEXT, IMAGE, FILE, SYSTEM
    }
    
    public enum MessageStatus {
        SENT, DELIVERED, READ, ARCHIVED
    }
    
    // Constructors
    public ChatMessage() {
        this.createdAt = LocalDateTime.now();
        this.status = MessageStatus.SENT;
        this.isFromVisitor = true;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getSenderName() {
        return senderName;
    }
    
    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
    
    public String getSenderEmail() {
        return senderEmail;
    }
    
    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }
    
    public String getSenderPhone() {
        return senderPhone;
    }
    
    public void setSenderPhone(String senderPhone) {
        this.senderPhone = senderPhone;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public MessageType getType() {
        return type;
    }
    
    public void setType(MessageType type) {
        this.type = type;
    }
    
    public MessageStatus getStatus() {
        return status;
    }
    
    public void setStatus(MessageStatus status) {
        this.status = status;
    }
    
    public Staff getAssignedStaff() {
        return assignedStaff;
    }
    
    public void setAssignedStaff(Staff assignedStaff) {
        this.assignedStaff = assignedStaff;
    }
    
    public Boolean getIsFromVisitor() {
        return isFromVisitor;
    }
    
    public void setIsFromVisitor(Boolean isFromVisitor) {
        this.isFromVisitor = isFromVisitor;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getReadAt() {
        return readAt;
    }
    
    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        if (this.status == MessageStatus.READ && this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }
} 