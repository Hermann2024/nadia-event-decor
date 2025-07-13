package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);
    
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.sessionId = :sessionId AND m.isFromVisitor = true AND m.status = 'SENT'")
    Long countUnreadMessagesBySessionId(@Param("sessionId") String sessionId);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.sessionId = :sessionId ORDER BY m.createdAt DESC")
    List<ChatMessage> findLatestMessagesBySessionId(@Param("sessionId") String sessionId, org.springframework.data.domain.Pageable pageable);
    
    List<ChatMessage> findByAssignedStaffIdAndStatusOrderByCreatedAtDesc(Long staffId, ChatMessage.MessageStatus status);
    
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.assignedStaff.id = :staffId AND m.status = 'SENT' AND m.isFromVisitor = true")
    Long countUnreadMessagesForStaff(@Param("staffId") Long staffId);
} 