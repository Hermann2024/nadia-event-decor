package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.Staff;
import com.nadiaevents.admin.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/staff")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class StaffController {
    
    @Autowired
    private StaffService staffService;
    
    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        List<Staff> staff = staffService.getAllStaff();
        return ResponseEntity.ok(staff);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createStaff(@RequestBody Staff staff) {
        try {
            Staff savedStaff = staffService.createStaff(staff);
            return ResponseEntity.ok(savedStaff);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Erreur interne du serveur: " + e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
        try {
            if (staff.getHireDate() == null) {
                staff.setHireDate(LocalDateTime.now());
            }
            
            Staff updatedStaff = staffService.updateStaff(id, staff);
            return ResponseEntity.ok(updatedStaff);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Erreur interne du serveur: " + e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        try {
            staffService.deleteStaff(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Erreur interne du serveur: " + e.getMessage(),
                "timestamp", System.currentTimeMillis()
            ));
        }
    }
    
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Staff>> getStaffByDepartment(@PathVariable String department) {
        List<Staff> staff = staffService.getStaffByDepartment(department);
        return ResponseEntity.ok(staff);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Staff>> getStaffByStatus(@PathVariable Staff.StaffStatus status) {
        List<Staff> staff = staffService.getStaffByStatus(status);
        return ResponseEntity.ok(staff);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Staff>> getActiveStaff() {
        List<Staff> staff = staffService.getActiveStaff();
        return ResponseEntity.ok(staff);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStaffStats() {
        Map<String, Object> stats = staffService.getStaffStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/department")
    public ResponseEntity<Map<String, Object>> getDepartmentStats() {
        Map<String, Object> stats = staffService.getDepartmentStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/salary")
    public ResponseEntity<Map<String, Object>> getSalaryStats() {
        Map<String, Object> stats = staffService.getSalaryStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/turnover")
    public ResponseEntity<Map<String, Object>> getStaffTurnoverStats() {
        Map<String, Object> stats = staffService.getStaffTurnoverStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/performance")
    public ResponseEntity<Map<String, Object>> getStaffPerformanceMetrics() {
        Map<String, Object> metrics = staffService.getStaffPerformanceMetrics();
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/stats/cost-analysis")
    public ResponseEntity<Map<String, Object>> getStaffCostAnalysis() {
        Map<String, Object> analysis = staffService.getStaffCostAnalysis();
        return ResponseEntity.ok(analysis);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Staff>> searchStaff(@RequestParam String query) {
        List<Staff> staff = staffService.searchStaff(query);
        return ResponseEntity.ok(staff);
    }
    
    @GetMapping("/hired")
    public ResponseEntity<List<Staff>> getStaffByHireDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<Staff> staff = staffService.getStaffByHireDateRange(startDate, endDate);
        return ResponseEntity.ok(staff);
    }
    
    @GetMapping("/salary-range")
    public ResponseEntity<Map<String, Object>> getStaffBySalaryRange(
            @RequestParam BigDecimal minSalary,
            @RequestParam BigDecimal maxSalary) {
        Map<String, Object> result = staffService.getStaffBySalaryRange(minSalary, maxSalary);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<String> departments = staffService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    
    @GetMapping("/positions")
    public ResponseEntity<List<String>> getAllPositions() {
        List<String> positions = staffService.getAllPositions();
        return ResponseEntity.ok(positions);
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllStaffStatuses() {
        List<String> statuses = List.of("ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED");
        return ResponseEntity.ok(statuses);
    }
} 