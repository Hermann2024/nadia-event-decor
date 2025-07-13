package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.QuoteRequest;
import com.nadiaevents.admin.model.Staff;
import com.nadiaevents.admin.repository.QuoteRequestRepository;
import com.nadiaevents.admin.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
@Transactional
public class QuoteRequestService {
    
    @Autowired
    private QuoteRequestRepository quoteRequestRepository;
    
    @Autowired
    private StaffRepository staffRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EmailService emailService;
    
    public QuoteRequest createQuoteRequest(QuoteRequest quoteRequest) {
        // Générer un numéro de demande unique
        String requestNumber = generateRequestNumber();
        quoteRequest.setRequestNumber(requestNumber);
        
        // Sauvegarder la demande
        QuoteRequest savedRequest = quoteRequestRepository.save(quoteRequest);
        
        // Envoyer une notification à tous les administrateurs
        notificationService.notifyNewQuoteRequest(savedRequest);
        
        // Envoyer un email de confirmation au client
        emailService.sendQuoteRequestConfirmation(savedRequest);
        
        return savedRequest;
    }
    
    public QuoteRequest updateQuoteRequest(Long id, QuoteRequest quoteRequest) {
        Optional<QuoteRequest> existingRequest = quoteRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            QuoteRequest request = existingRequest.get();
            
            // Mettre à jour les champs
            request.setStatus(quoteRequest.getStatus());
            request.setAssignedTo(quoteRequest.getAssignedTo());
            request.setPriority(quoteRequest.getPriority());
            request.setEstimatedCompletionDate(quoteRequest.getEstimatedCompletionDate());
            request.setNotes(quoteRequest.getNotes());
            
            QuoteRequest updatedRequest = quoteRequestRepository.save(request);
            
            // Envoyer des notifications appropriées
            if (quoteRequest.getAssignedTo() != null) {
                notificationService.notifyQuoteRequestAssigned(updatedRequest);
            }
            
            return updatedRequest;
        }
        throw new RuntimeException("Demande de devis non trouvée avec l'ID: " + id);
    }
    
    public QuoteRequest assignQuoteRequest(Long requestId, Long staffId) {
        Optional<QuoteRequest> requestOpt = quoteRequestRepository.findById(requestId);
        Optional<Staff> staffOpt = staffRepository.findById(staffId);
        
        if (requestOpt.isPresent() && staffOpt.isPresent()) {
            QuoteRequest request = requestOpt.get();
            Staff staff = staffOpt.get();
            
            request.setAssignedTo(staff);
            request.setStatus(QuoteRequest.QuoteRequestStatus.ASSIGNED);
            
            QuoteRequest updatedRequest = quoteRequestRepository.save(request);
            
            // Notifier le membre du staff assigné
            notificationService.notifyQuoteRequestAssigned(updatedRequest);
            
            return updatedRequest;
        }
        throw new RuntimeException("Demande de devis ou membre du staff non trouvé");
    }
    
    public QuoteRequest updateStatus(Long requestId, QuoteRequest.QuoteRequestStatus status) {
        Optional<QuoteRequest> requestOpt = quoteRequestRepository.findById(requestId);
        if (requestOpt.isPresent()) {
            QuoteRequest request = requestOpt.get();
            request.setStatus(status);
            
            if (status == QuoteRequest.QuoteRequestStatus.QUOTE_PREPARED) {
                request.setCompletedDate(LocalDateTime.now());
            }
            
            QuoteRequest updatedRequest = quoteRequestRepository.save(request);
            
            // Notifier les changements de statut
            notificationService.notifyQuoteRequestStatusChanged(updatedRequest);
            
            return updatedRequest;
        }
        throw new RuntimeException("Demande de devis non trouvée");
    }
    
    public List<QuoteRequest> getAllQuoteRequests() {
        return quoteRequestRepository.findByOrderByCreatedAtDesc();
    }
    
    public List<QuoteRequest> getQuoteRequestsByStatus(QuoteRequest.QuoteRequestStatus status) {
        return quoteRequestRepository.findByStatus(status);
    }
    
    public List<QuoteRequest> getQuoteRequestsByStaff(Long staffId) {
        return quoteRequestRepository.findByAssignedToId(staffId);
    }
    
    public List<QuoteRequest> getOverdueRequests() {
        return quoteRequestRepository.findOverdueRequests(LocalDateTime.now());
    }
    
    public QuoteRequest getQuoteRequestById(Long id) {
        return quoteRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de devis non trouvée avec l'ID: " + id));
    }
    
    public void deleteQuoteRequest(Long id) {
        quoteRequestRepository.deleteById(id);
    }
    
    private String generateRequestNumber() {
        LocalDateTime now = LocalDateTime.now();
        String datePrefix = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Compter les demandes créées aujourd'hui
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        List<QuoteRequest> todayRequests = quoteRequestRepository.findByEventDateBetween(startOfDay, endOfDay);
        int sequenceNumber = todayRequests.size() + 1;
        
        return String.format("QR-%s-%03d", datePrefix, sequenceNumber);
    }
    
    public long getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus status) {
        return quoteRequestRepository.countByStatus(status);
    }
    
    public long getActiveRequestCountByStaff(Long staffId) {
        return quoteRequestRepository.countActiveRequestsByStaff(staffId);
    }
    
    public Map<String, Object> getQuoteRequestStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les demandes par statut
        stats.put("new", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.NEW));
        stats.put("assigned", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.ASSIGNED));
        stats.put("inProgress", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.IN_PROGRESS));
        stats.put("quotePrepared", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.QUOTE_PREPARED));
        stats.put("sent", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.SENT));
        stats.put("accepted", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.ACCEPTED));
        stats.put("rejected", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.REJECTED));
        stats.put("cancelled", getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.CANCELLED));
        
        // Compter les demandes en retard
        List<QuoteRequest> overdueRequests = getOverdueRequests();
        stats.put("overdue", overdueRequests.size());
        
        return stats;
    }
} 