package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.Notification;
import com.nadiaevents.admin.model.QuoteRequest;
import com.nadiaevents.admin.model.Staff;
import com.nadiaevents.admin.repository.NotificationRepository;
import com.nadiaevents.admin.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private StaffRepository staffRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public Notification createNotification(Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        
        // Envoyer la notification via WebSocket si le destinataire est connecté
        if (notification.getRecipient() != null) {
            messagingTemplate.convertAndSendToUser(
                notification.getRecipient().getId().toString(),
                "/queue/notifications",
                savedNotification
            );
        }
        
        return savedNotification;
    }
    
    public void notifyNewQuoteRequest(QuoteRequest quoteRequest) {
        // Notifier tous les administrateurs
        List<Staff> admins = staffRepository.findByDepartment("ADMIN");
        
        for (Staff admin : admins) {
            Notification notification = new Notification();
            notification.setTitle("Nouvelle demande de devis");
            notification.setMessage("Une nouvelle demande de devis a été reçue de " + quoteRequest.getClientName());
            notification.setType(Notification.NotificationType.QUOTE_REQUEST_NEW);
            notification.setRecipient(admin);
            notification.setRelatedEntityType("QUOTE_REQUEST");
            notification.setRelatedEntityId(quoteRequest.getId());
            
            createNotification(notification);
        }
    }
    
    public void notifyQuoteRequestAssigned(QuoteRequest quoteRequest) {
        if (quoteRequest.getAssignedTo() != null) {
            Notification notification = new Notification();
            notification.setTitle("Demande de devis assignée");
            notification.setMessage("Vous avez été assigné à la demande de devis " + quoteRequest.getRequestNumber());
            notification.setType(Notification.NotificationType.QUOTE_REQUEST_ASSIGNED);
            notification.setRecipient(quoteRequest.getAssignedTo());
            notification.setRelatedEntityType("QUOTE_REQUEST");
            notification.setRelatedEntityId(quoteRequest.getId());
            
            createNotification(notification);
        }
    }
    
    public void notifyQuoteRequestStatusChanged(QuoteRequest quoteRequest) {
        if (quoteRequest.getAssignedTo() != null) {
            Notification notification = new Notification();
            notification.setTitle("Statut de demande mis à jour");
            notification.setMessage("Le statut de la demande " + quoteRequest.getRequestNumber() + " a été changé à " + quoteRequest.getStatus());
            notification.setType(Notification.NotificationType.QUOTE_REQUEST_UPDATED);
            notification.setRecipient(quoteRequest.getAssignedTo());
            notification.setRelatedEntityType("QUOTE_REQUEST");
            notification.setRelatedEntityId(quoteRequest.getId());
            
            createNotification(notification);
        }
    }
    
    public void notifyQuoteCreated(Long quoteId, String quoteNumber, Staff assignedTo) {
        Notification notification = new Notification();
        notification.setTitle("Devis créé");
        notification.setMessage("Le devis " + quoteNumber + " a été créé avec succès");
        notification.setType(Notification.NotificationType.QUOTE_CREATED);
        notification.setRecipient(assignedTo);
        notification.setRelatedEntityType("QUOTE");
        notification.setRelatedEntityId(quoteId);
        
        createNotification(notification);
    }
    
    public void notifyInvoiceCreated(Long invoiceId, String invoiceNumber, Staff assignedTo) {
        Notification notification = new Notification();
        notification.setTitle("Facture créée");
        notification.setMessage("La facture " + invoiceNumber + " a été créée avec succès");
        notification.setType(Notification.NotificationType.INVOICE_CREATED);
        notification.setRecipient(assignedTo);
        notification.setRelatedEntityType("INVOICE");
        notification.setRelatedEntityId(invoiceId);
        
        createNotification(notification);
    }
    
    public void notifyInvoiceOverdue(Long invoiceId, String invoiceNumber, Staff assignedTo) {
        Notification notification = new Notification();
        notification.setTitle("Facture en retard");
        notification.setMessage("La facture " + invoiceNumber + " est en retard de paiement");
        notification.setType(Notification.NotificationType.INVOICE_OVERDUE);
        notification.setRecipient(assignedTo);
        notification.setRelatedEntityType("INVOICE");
        notification.setRelatedEntityId(invoiceId);
        
        createNotification(notification);
    }
    
    public List<Notification> getNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findRecentNotificationsByRecipient(recipientId);
    }
    
    public List<Notification> getUnreadNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findUnreadNotificationsByRecipient(recipientId);
    }
    
    public long getUnreadNotificationCount(Long recipientId) {
        return notificationRepository.countUnreadNotificationsByRecipient(recipientId);
    }
    
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        notification.setStatus(Notification.NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long recipientId) {
        List<Notification> unreadNotifications = getUnreadNotificationsByRecipient(recipientId);
        
        for (Notification notification : unreadNotifications) {
            notification.setStatus(Notification.NotificationStatus.READ);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }
    
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    public void deleteOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        // Implémenter la suppression des anciennes notifications
        // Cette méthode pourrait être appelée par un job programmé
    }
} 