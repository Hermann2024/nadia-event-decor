package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.QuoteRequest;
import com.nadiaevents.admin.model.Staff;
import com.nadiaevents.admin.service.QuoteRequestService;
import com.nadiaevents.admin.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/quote-requests")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class QuoteRequestController {
    
    @Autowired
    private QuoteRequestService quoteRequestService;
    
    @Autowired
    private StaffService staffService;
    
    @PostMapping
    public ResponseEntity<QuoteRequest> createQuoteRequest(@RequestBody QuoteRequest quoteRequest) {
        QuoteRequest created = quoteRequestService.createQuoteRequest(quoteRequest);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping
    public ResponseEntity<List<QuoteRequest>> getAllQuoteRequests() {
        List<QuoteRequest> requests = quoteRequestService.getAllQuoteRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuoteRequest> getQuoteRequestById(@PathVariable Long id) {
        QuoteRequest request = quoteRequestService.getQuoteRequestById(id);
        return ResponseEntity.ok(request);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<QuoteRequest>> getQuoteRequestsByStatus(@PathVariable String status) {
        QuoteRequest.QuoteRequestStatus requestStatus = QuoteRequest.QuoteRequestStatus.valueOf(status.toUpperCase());
        List<QuoteRequest> requests = quoteRequestService.getQuoteRequestsByStatus(requestStatus);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<QuoteRequest>> getQuoteRequestsByStaff(@PathVariable Long staffId) {
        List<QuoteRequest> requests = quoteRequestService.getQuoteRequestsByStaff(staffId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<List<QuoteRequest>> getOverdueRequests() {
        List<QuoteRequest> requests = quoteRequestService.getOverdueRequests();
        return ResponseEntity.ok(requests);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<QuoteRequest> updateQuoteRequest(@PathVariable Long id, @RequestBody QuoteRequest quoteRequest) {
        QuoteRequest updated = quoteRequestService.updateQuoteRequest(id, quoteRequest);
        return ResponseEntity.ok(updated);
    }
    
    @PutMapping("/{id}/assign/{staffId}")
    public ResponseEntity<QuoteRequest> assignQuoteRequest(@PathVariable Long id, @PathVariable Long staffId) {
        QuoteRequest assigned = quoteRequestService.assignQuoteRequest(id, staffId);
        return ResponseEntity.ok(assigned);
    }
    
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<QuoteRequest> updateStatus(@PathVariable Long id, @PathVariable String status) {
        QuoteRequest.QuoteRequestStatus requestStatus = QuoteRequest.QuoteRequestStatus.valueOf(status.toUpperCase());
        QuoteRequest updated = quoteRequestService.updateStatus(id, requestStatus);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuoteRequest(@PathVariable Long id) {
        quoteRequestService.deleteQuoteRequest(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getQuoteRequestStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les demandes par statut
        stats.put("new", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.NEW));
        stats.put("assigned", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.ASSIGNED));
        stats.put("inProgress", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.IN_PROGRESS));
        stats.put("quotePrepared", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.QUOTE_PREPARED));
        stats.put("sent", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.SENT));
        stats.put("accepted", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.ACCEPTED));
        stats.put("rejected", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.REJECTED));
        stats.put("cancelled", quoteRequestService.getQuoteRequestCountByStatus(QuoteRequest.QuoteRequestStatus.CANCELLED));
        
        // Compter les demandes en retard
        List<QuoteRequest> overdueRequests = quoteRequestService.getOverdueRequests();
        stats.put("overdue", overdueRequests.size());
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/staff/{staffId}/stats")
    public ResponseEntity<Map<String, Object>> getStaffQuoteRequestStats(@PathVariable Long staffId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les demandes actives par membre du staff
        long activeRequests = quoteRequestService.getActiveRequestCountByStaff(staffId);
        stats.put("activeRequests", activeRequests);
        
        // Obtenir la liste des demandes assignées
        List<QuoteRequest> assignedRequests = quoteRequestService.getQuoteRequestsByStaff(staffId);
        stats.put("assignedRequests", assignedRequests);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/available-staff")
    public ResponseEntity<List<Staff>> getAvailableStaff() {
        List<Staff> availableStaff = staffService.getAllStaff();
        return ResponseEntity.ok(availableStaff);
    }
} 