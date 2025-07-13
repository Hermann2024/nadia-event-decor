package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "invoices")
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(name = "client_email")
    private String clientEmail;
    
    @Column(name = "client_phone")
    private String clientPhone;
    
    @Column(name = "client_address")
    private String clientAddress;
    
    @Column(name = "event_date")
    private LocalDateTime eventDate;
    
    @Column(name = "event_type")
    private String eventType;
    
    @Column(name = "event_location")
    private String eventLocation;
    
    @Column(name = "subtotal")
    private BigDecimal subtotal;
    
    @Column(name = "tax_amount")
    private BigDecimal taxAmount;
    
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "company_info_id")
    private Long companyInfoId;
    
    @Column(name = "header_text")
    private String headerText;
    
    @Column(name = "footer_text")
    private String footerText;
    
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<InvoiceItem> items;
    
    public enum InvoiceStatus {
        DRAFT, SENT, PAID, OVERDUE, CANCELLED
    }
    
    // Constructors
    public Invoice() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = InvoiceStatus.DRAFT;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
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
    
    public String getClientAddress() {
        return clientAddress;
    }
    
    public void setClientAddress(String clientAddress) {
        this.clientAddress = clientAddress;
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
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public InvoiceStatus getStatus() {
        return status;
    }
    
    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public Long getCompanyInfoId() {
        return companyInfoId;
    }
    
    public void setCompanyInfoId(Long companyInfoId) {
        this.companyInfoId = companyInfoId;
    }
    
    public String getHeaderText() {
        return headerText;
    }
    
    public void setHeaderText(String headerText) {
        this.headerText = headerText;
    }
    
    public String getFooterText() {
        return footerText;
    }
    
    public void setFooterText(String footerText) {
        this.footerText = footerText;
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
    
    public List<InvoiceItem> getItems() {
        return items;
    }
    
    public void setItems(List<InvoiceItem> items) {
        this.items = items;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 