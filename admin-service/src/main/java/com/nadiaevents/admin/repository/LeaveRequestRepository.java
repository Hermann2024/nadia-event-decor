package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByStaffId(Long staffId);
    
    List<LeaveRequest> findByStatus(LeaveRequest.LeaveStatus status);
    
    List<LeaveRequest> findByLeaveType(LeaveRequest.LeaveType leaveType);
    
    List<LeaveRequest> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.staff.id = :staffId AND lr.status = 'APPROVED' AND lr.startDate BETWEEN :startDate AND :endDate")
    List<LeaveRequest> findApprovedLeaveByStaffAndDateRange(@Param("staffId") Long staffId, 
                                                           @Param("startDate") LocalDateTime startDate, 
                                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'PENDING'")
    Long countPendingRequests();
    
    @Query("SELECT lr.leaveType, COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'APPROVED' GROUP BY lr.leaveType")
    List<Object[]> countByLeaveType();
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
           "LOWER(lr.staff.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(lr.staff.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(lr.reason) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<LeaveRequest> searchLeaveRequests(@Param("query") String query);
} 