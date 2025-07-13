package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.Notification;
import com.nadiaevents.admin.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByRecipient(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByRecipient(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadNotificationCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }
    
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getNotificationsByRecipient(null);
        return ResponseEntity.ok(notifications);
    }
    
    // WebSocket endpoints
    @MessageMapping("/notifications")
    @SendTo("/topic/notifications")
    public Notification handleNotification(Notification notification) {
        return notification;
    }
} 