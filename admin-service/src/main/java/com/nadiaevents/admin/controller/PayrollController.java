package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.Payroll;
import com.nadiaevents.admin.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/payroll")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class PayrollController {
    
    @Autowired
    private PayrollService payrollService;
    
    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {
        List<Payroll> payrolls = payrollService.getAllPayrolls();
        return ResponseEntity.ok(payrolls);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createPayroll(@RequestBody Payroll payroll) {
        try {
            Payroll savedPayroll = payrollService.createPayroll(payroll);
            return ResponseEntity.ok(savedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll) {
        try {
            Payroll updatedPayroll = payrollService.updatePayroll(id, payroll);
            return ResponseEntity.ok(updatedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/process")
    public ResponseEntity<?> processPayroll(@PathVariable Long id) {
        try {
            Payroll processedPayroll = payrollService.processPayroll(id);
            return ResponseEntity.ok(processedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<?> markPayrollAsPaid(@PathVariable Long id) {
        try {
            Payroll paidPayroll = payrollService.markAsPaid(id);
            return ResponseEntity.ok(paidPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayroll(@PathVariable Long id) {
        try {
            payrollService.deletePayroll(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<Payroll>> getPayrollsByStaff(@PathVariable Long staffId) {
        List<Payroll> payrolls = payrollService.getPayrollsByStaff(staffId);
        return ResponseEntity.ok(payrolls);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payroll>> getPayrollsByStatus(@PathVariable Payroll.PayrollStatus status) {
        List<Payroll> payrolls = payrollService.getPayrollsByStatus(status);
        return ResponseEntity.ok(payrolls);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Payroll>> getPendingPayrolls() {
        List<Payroll> payrolls = payrollService.getPendingPayrolls();
        return ResponseEntity.ok(payrolls);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPayrollStats() {
        Map<String, Object> stats = payrollService.getPayrollStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getPayrollByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        Map<String, Object> payrollData = payrollService.getPayrollByDateRange(startDate, endDate);
        return ResponseEntity.ok(payrollData);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Payroll>> searchPayrolls(@RequestParam String query) {
        List<Payroll> payrolls = payrollService.searchPayrolls(query);
        return ResponseEntity.ok(payrolls);
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllPayrollStatuses() {
        List<String> statuses = List.of("PENDING", "PROCESSED", "PAID", "CANCELLED");
        return ResponseEntity.ok(statuses);
    }
} 