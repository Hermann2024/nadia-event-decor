package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.LeaveRequest;
import com.nadiaevents.admin.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/leave-requests")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class LeaveRequestController {
    
    @Autowired
    private LeaveRequestService leaveRequestService;
    
    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        List<LeaveRequest> requests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        return leaveRequestService.getLeaveRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        try {
            LeaveRequest savedRequest = leaveRequestService.createLeaveRequest(leaveRequest);
            return ResponseEntity.ok(savedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateLeaveRequest(@PathVariable Long id, @RequestBody LeaveRequest leaveRequest) {
        try {
            LeaveRequest updatedRequest = leaveRequestService.updateLeaveRequest(id, leaveRequest);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveLeaveRequest(@PathVariable Long id, @RequestParam String approvedBy) {
        try {
            LeaveRequest approvedRequest = leaveRequestService.approveLeaveRequest(id, approvedBy);
            return ResponseEntity.ok(approvedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectLeaveRequest(@PathVariable Long id, 
                                              @RequestParam String rejectedBy,
                                              @RequestParam String comments) {
        try {
            LeaveRequest rejectedRequest = leaveRequestService.rejectLeaveRequest(id, rejectedBy, comments);
            return ResponseEntity.ok(rejectedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeaveRequest(@PathVariable Long id) {
        try {
            leaveRequestService.deleteLeaveRequest(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStaff(@PathVariable Long staffId) {
        List<LeaveRequest> requests = leaveRequestService.getLeaveRequestsByStaff(staffId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStatus(@PathVariable LeaveRequest.LeaveStatus status) {
        List<LeaveRequest> requests = leaveRequestService.getLeaveRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaveRequests() {
        List<LeaveRequest> requests = leaveRequestService.getPendingLeaveRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getLeaveStats() {
        Map<String, Object> stats = leaveRequestService.getLeaveStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/staff/{staffId}/balance")
    public ResponseEntity<Map<String, Object>> getStaffLeaveBalance(@PathVariable Long staffId) {
        Map<String, Object> balance = leaveRequestService.getStaffLeaveBalance(staffId);
        return ResponseEntity.ok(balance);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<LeaveRequest>> searchLeaveRequests(@RequestParam String query) {
        List<LeaveRequest> requests = leaveRequestService.searchLeaveRequests(query);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllLeaveTypes() {
        List<String> types = List.of(
            "ANNUAL_LEAVE", "SICK_LEAVE", "MATERNITY_LEAVE", "PATERNITY_LEAVE",
            "UNPAID_LEAVE", "COMPENSATORY_LEAVE", "OTHER"
        );
        return ResponseEntity.ok(types);
    }
    
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllLeaveStatuses() {
        List<String> statuses = List.of("PENDING", "APPROVED", "REJECTED", "CANCELLED");
        return ResponseEntity.ok(statuses);
    }
} 