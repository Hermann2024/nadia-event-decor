package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.Payroll;
import com.nadiaevents.admin.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PayrollService {
    
    @Autowired
    private PayrollRepository payrollRepository;
    
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }
    
    public Optional<Payroll> getPayrollById(Long id) {
        return payrollRepository.findById(id);
    }
    
    public Payroll createPayroll(Payroll payroll) {
        validatePayroll(payroll);
        
        payroll.setCreatedAt(LocalDateTime.now());
        payroll.setUpdatedAt(LocalDateTime.now());
        payroll.setStatus(Payroll.PayrollStatus.PENDING);
        
        // Calculer le salaire net
        calculateNetSalary(payroll);
        
        return payrollRepository.save(payroll);
    }
    
    public Payroll updatePayroll(Long id, Payroll payroll) {
        Optional<Payroll> existingPayroll = payrollRepository.findById(id);
        if (existingPayroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with id: " + id);
        }
        
        validatePayroll(payroll);
        
        payroll.setId(id);
        payroll.setUpdatedAt(LocalDateTime.now());
        payroll.setCreatedAt(existingPayroll.get().getCreatedAt());
        
        // Recalculer le salaire net
        calculateNetSalary(payroll);
        
        return payrollRepository.save(payroll);
    }
    
    public Payroll processPayroll(Long id) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with id: " + id);
        }
        
        Payroll pay = payroll.get();
        pay.setStatus(Payroll.PayrollStatus.PROCESSED);
        pay.setUpdatedAt(LocalDateTime.now());
        
        return payrollRepository.save(pay);
    }
    
    public Payroll markAsPaid(Long id) {
        Optional<Payroll> payroll = payrollRepository.findById(id);
        if (payroll.isEmpty()) {
            throw new RuntimeException("Payroll not found with id: " + id);
        }
        
        Payroll pay = payroll.get();
        pay.setStatus(Payroll.PayrollStatus.PAID);
        pay.setPaymentDate(LocalDateTime.now());
        pay.setUpdatedAt(LocalDateTime.now());
        
        return payrollRepository.save(pay);
    }
    
    public void deletePayroll(Long id) {
        if (!payrollRepository.existsById(id)) {
            throw new RuntimeException("Payroll not found with id: " + id);
        }
        payrollRepository.deleteById(id);
    }
    
    public List<Payroll> getPayrollsByStaff(Long staffId) {
        return payrollRepository.findByStaffId(staffId);
    }
    
    public List<Payroll> getPayrollsByStatus(Payroll.PayrollStatus status) {
        return payrollRepository.findByStatus(status);
    }
    
    public List<Payroll> getPendingPayrolls() {
        return payrollRepository.findByStatus(Payroll.PayrollStatus.PENDING);
    }
    
    public Map<String, Object> getPayrollStats() {
        Long pendingPayrolls = payrollRepository.countPendingPayrolls();
        BigDecimal totalPayroll = payrollRepository.getTotalPayrollByDateRange(
            LocalDateTime.now().minusMonths(1), LocalDateTime.now());
        List<Object[]> byDepartment = payrollRepository.getPayrollByDepartment();
        BigDecimal averageSalary = payrollRepository.getAverageSalary();
        
        return Map.of(
            "pendingPayrolls", pendingPayrolls,
            "totalPayrollLastMonth", totalPayroll != null ? totalPayroll : BigDecimal.ZERO,
            "byDepartment", byDepartment,
            "averageSalary", averageSalary != null ? averageSalary : BigDecimal.ZERO
        );
    }
    
    public Map<String, Object> getPayrollByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal totalPayroll = payrollRepository.getTotalPayrollByDateRange(startDate, endDate);
        List<Object[]> byDepartment = payrollRepository.getPayrollByDepartment();
        
        return Map.of(
            "totalPayroll", totalPayroll != null ? totalPayroll : BigDecimal.ZERO,
            "byDepartment", byDepartment,
            "startDate", startDate,
            "endDate", endDate
        );
    }
    
    public List<Payroll> searchPayrolls(String query) {
        // Implémenter la recherche si nécessaire
        return payrollRepository.findAll();
    }
    
    private void validatePayroll(Payroll payroll) {
        if (payroll.getStaff() == null) {
            throw new RuntimeException("Staff is required");
        }
        if (payroll.getPayPeriodStart() == null) {
            throw new RuntimeException("Pay period start is required");
        }
        if (payroll.getPayPeriodEnd() == null) {
            throw new RuntimeException("Pay period end is required");
        }
        if (payroll.getBasicSalary() == null || payroll.getBasicSalary().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Basic salary must be greater than 0");
        }
    }
    
    private void calculateNetSalary(Payroll payroll) {
        BigDecimal netSalary = payroll.getBasicSalary()
                .add(payroll.getOvertimePay() != null ? payroll.getOvertimePay() : BigDecimal.ZERO)
                .add(payroll.getBonus() != null ? payroll.getBonus() : BigDecimal.ZERO)
                .subtract(payroll.getDeductions() != null ? payroll.getDeductions() : BigDecimal.ZERO);
        
        payroll.setNetSalary(netSalary);
    }
} 