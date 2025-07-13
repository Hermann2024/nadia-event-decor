package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;
    
    @Column(name = "pay_period_start", nullable = false)
    private LocalDateTime payPeriodStart;
    
    @Column(name = "pay_period_end", nullable = false)
    private LocalDateTime payPeriodEnd;
    
    @Column(name = "basic_salary", nullable = false)
    private BigDecimal basicSalary;
    
    @Column(name = "overtime_pay")
    private BigDecimal overtimePay;
    
    @Column(name = "bonus")
    private BigDecimal bonus;
    
    @Column(name = "deductions")
    private BigDecimal deductions;
    
    @Column(name = "net_salary", nullable = false)
    private BigDecimal netSalary;
    
    @Enumerated(EnumType.STRING)
    private PayrollStatus status;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PayrollStatus {
        PENDING, PROCESSED, PAID, CANCELLED
    }
    
    // Constructors
    public Payroll() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = PayrollStatus.PENDING;
        this.overtimePay = BigDecimal.ZERO;
        this.bonus = BigDecimal.ZERO;
        this.deductions = BigDecimal.ZERO;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Staff getStaff() {
        return staff;
    }
    
    public void setStaff(Staff staff) {
        this.staff = staff;
    }
    
    public LocalDateTime getPayPeriodStart() {
        return payPeriodStart;
    }
    
    public void setPayPeriodStart(LocalDateTime payPeriodStart) {
        this.payPeriodStart = payPeriodStart;
    }
    
    public LocalDateTime getPayPeriodEnd() {
        return payPeriodEnd;
    }
    
    public void setPayPeriodEnd(LocalDateTime payPeriodEnd) {
        this.payPeriodEnd = payPeriodEnd;
    }
    
    public BigDecimal getBasicSalary() {
        return basicSalary;
    }
    
    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }
    
    public BigDecimal getOvertimePay() {
        return overtimePay;
    }
    
    public void setOvertimePay(BigDecimal overtimePay) {
        this.overtimePay = overtimePay;
    }
    
    public BigDecimal getBonus() {
        return bonus;
    }
    
    public void setBonus(BigDecimal bonus) {
        this.bonus = bonus;
    }
    
    public BigDecimal getDeductions() {
        return deductions;
    }
    
    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
    }
    
    public BigDecimal getNetSalary() {
        return netSalary;
    }
    
    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }
    
    public PayrollStatus getStatus() {
        return status;
    }
    
    public void setStatus(PayrollStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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