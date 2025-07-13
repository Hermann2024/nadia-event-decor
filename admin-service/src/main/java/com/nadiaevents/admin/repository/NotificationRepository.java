package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByRecipientId(Long recipientId);
    
    List<Notification> findByRecipientIdAndStatus(Long recipientId, Notification.NotificationStatus status);
    
    List<Notification> findByType(Notification.NotificationType type);
    
    List<Notification> findByRelatedEntityTypeAndRelatedEntityId(String entityType, Long entityId);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :recipientId ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotificationsByRecipient(@Param("recipientId") Long recipientId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :recipientId AND n.status = 'UNREAD'")
    long countUnreadNotificationsByRecipient(@Param("recipientId") Long recipientId);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient.id = :recipientId AND n.status = 'UNREAD' ORDER BY n.createdAt DESC")
    List<Notification> findUnreadNotificationsByRecipient(@Param("recipientId") Long recipientId);
    
    List<Notification> findByOrderByCreatedAtDesc();
} 