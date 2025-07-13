package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.QuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {
    
    List<QuoteRequest> findByStatus(QuoteRequest.QuoteRequestStatus status);
    
    List<QuoteRequest> findByAssignedToId(Long staffId);
    
    List<QuoteRequest> findByPriority(String priority);
    
    List<QuoteRequest> findByClientEmail(String clientEmail);
    
    List<QuoteRequest> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT qr FROM QuoteRequest qr WHERE qr.status = :status AND qr.assignedTo.id = :staffId")
    List<QuoteRequest> findByStatusAndAssignedTo(@Param("status") QuoteRequest.QuoteRequestStatus status, 
                                                @Param("staffId") Long staffId);
    
    @Query("SELECT qr FROM QuoteRequest qr WHERE qr.estimatedCompletionDate <= :date AND qr.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<QuoteRequest> findOverdueRequests(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(qr) FROM QuoteRequest qr WHERE qr.status = :status")
    long countByStatus(@Param("status") QuoteRequest.QuoteRequestStatus status);
    
    @Query("SELECT COUNT(qr) FROM QuoteRequest qr WHERE qr.assignedTo.id = :staffId AND qr.status IN ('NEW', 'ASSIGNED', 'IN_PROGRESS')")
    long countActiveRequestsByStaff(@Param("staffId") Long staffId);
    
    List<QuoteRequest> findByOrderByCreatedAtDesc();
    
    List<QuoteRequest> findByOrderByPriorityAscCreatedAtDesc();
    
    List<QuoteRequest> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<QuoteRequest> findByRequestNumberStartingWithOrderByRequestNumberDesc(String prefix);
} 