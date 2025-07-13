package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.LeaveRequest;
import com.nadiaevents.admin.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LeaveRequestService {
    
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }
    
    public Optional<LeaveRequest> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id);
    }
    
    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        validateLeaveRequest(leaveRequest);
        
        leaveRequest.setCreatedAt(LocalDateTime.now());
        leaveRequest.setUpdatedAt(LocalDateTime.now());
        leaveRequest.setStatus(LeaveRequest.LeaveStatus.PENDING);
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public LeaveRequest updateLeaveRequest(Long id, LeaveRequest leaveRequest) {
        Optional<LeaveRequest> existingRequest = leaveRequestRepository.findById(id);
        if (existingRequest.isEmpty()) {
            throw new RuntimeException("Leave request not found with id: " + id);
        }
        
        validateLeaveRequest(leaveRequest);
        
        leaveRequest.setId(id);
        leaveRequest.setUpdatedAt(LocalDateTime.now());
        leaveRequest.setCreatedAt(existingRequest.get().getCreatedAt());
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public LeaveRequest approveLeaveRequest(Long id, String approvedBy) {
        Optional<LeaveRequest> leaveRequest = leaveRequestRepository.findById(id);
        if (leaveRequest.isEmpty()) {
            throw new RuntimeException("Leave request not found with id: " + id);
        }
        
        LeaveRequest request = leaveRequest.get();
        request.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        request.setApprovedBy(approvedBy);
        request.setApprovedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        
        return leaveRequestRepository.save(request);
    }
    
    public LeaveRequest rejectLeaveRequest(Long id, String rejectedBy, String comments) {
        Optional<LeaveRequest> leaveRequest = leaveRequestRepository.findById(id);
        if (leaveRequest.isEmpty()) {
            throw new RuntimeException("Leave request not found with id: " + id);
        }
        
        LeaveRequest request = leaveRequest.get();
        request.setStatus(LeaveRequest.LeaveStatus.REJECTED);
        request.setApprovedBy(rejectedBy);
        request.setApprovedAt(LocalDateTime.now());
        request.setComments(comments);
        request.setUpdatedAt(LocalDateTime.now());
        
        return leaveRequestRepository.save(request);
    }
    
    public void deleteLeaveRequest(Long id) {
        if (!leaveRequestRepository.existsById(id)) {
            throw new RuntimeException("Leave request not found with id: " + id);
        }
        leaveRequestRepository.deleteById(id);
    }
    
    public List<LeaveRequest> getLeaveRequestsByStaff(Long staffId) {
        return leaveRequestRepository.findByStaffId(staffId);
    }
    
    public List<LeaveRequest> getLeaveRequestsByStatus(LeaveRequest.LeaveStatus status) {
        return leaveRequestRepository.findByStatus(status);
    }
    
    public List<LeaveRequest> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatus(LeaveRequest.LeaveStatus.PENDING);
    }
    
    public Map<String, Object> getLeaveStats() {
        Long pendingRequests = leaveRequestRepository.countPendingRequests();
        List<Object[]> byLeaveType = leaveRequestRepository.countByLeaveType();
        
        return Map.of(
            "pendingRequests", pendingRequests,
            "byLeaveType", byLeaveType,
            "totalRequests", leaveRequestRepository.count()
        );
    }
    
    public List<LeaveRequest> searchLeaveRequests(String query) {
        return leaveRequestRepository.searchLeaveRequests(query);
    }
    
    public Map<String, Object> getStaffLeaveBalance(Long staffId) {
        // Calculer le solde de congés pour un employé
        List<LeaveRequest> approvedLeaves = leaveRequestRepository.findByStaffId(staffId);
        
        long totalDays = approvedLeaves.stream()
                .filter(leave -> leave.getStatus() == LeaveRequest.LeaveStatus.APPROVED)
                .mapToLong(leave -> ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()))
                .sum();
        
        return Map.of(
            "staffId", staffId,
            "totalLeaveDays", totalDays,
            "approvedLeaves", approvedLeaves.size()
        );
    }
    
    private void validateLeaveRequest(LeaveRequest leaveRequest) {
        if (leaveRequest.getStaff() == null) {
            throw new RuntimeException("Staff is required");
        }
        if (leaveRequest.getStartDate() == null) {
            throw new RuntimeException("Start date is required");
        }
        if (leaveRequest.getEndDate() == null) {
            throw new RuntimeException("End date is required");
        }
        if (leaveRequest.getStartDate().isAfter(leaveRequest.getEndDate())) {
            throw new RuntimeException("Start date cannot be after end date");
        }
        if (leaveRequest.getReason() == null || leaveRequest.getReason().trim().isEmpty()) {
            throw new RuntimeException("Reason is required");
        }
        if (leaveRequest.getLeaveType() == null) {
            throw new RuntimeException("Leave type is required");
        }
    }
} 