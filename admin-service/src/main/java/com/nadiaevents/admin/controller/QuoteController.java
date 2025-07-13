package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.Quote;
import com.nadiaevents.admin.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/quotes")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class QuoteController {
    
    @Autowired
    private QuoteService quoteService;
    
    @GetMapping
    public ResponseEntity<List<Quote>> getAllQuotes() {
        List<Quote> quotes = quoteService.getAllQuotes();
        return ResponseEntity.ok(quotes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Quote> getQuoteById(@PathVariable Long id) {
        return quoteService.getQuoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/with-company-info")
    public ResponseEntity<Map<String, Object>> getQuoteWithCompanyInfo(@PathVariable Long id) {
        try {
            Map<String, Object> result = quoteService.getQuoteWithCompanyInfo(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createQuote(@RequestBody Quote quote) {
        try {
            Quote savedQuote = quoteService.createQuote(quote);
            return ResponseEntity.ok(savedQuote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuote(@PathVariable Long id, @RequestBody Quote quote) {
        try {
            Quote updatedQuote = quoteService.updateQuote(id, quote);
            return ResponseEntity.ok(updatedQuote);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuote(@PathVariable Long id) {
        try {
            quoteService.deleteQuote(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Quote>> getQuotesByStatus(@PathVariable Quote.QuoteStatus status) {
        List<Quote> quotes = quoteService.getQuotesByStatus(status);
        return ResponseEntity.ok(quotes);
    }
    
    @GetMapping("/client/{clientName}")
    public ResponseEntity<List<Quote>> getQuotesByClientName(@PathVariable String clientName) {
        List<Quote> quotes = quoteService.getQuotesByClientName(clientName);
        return ResponseEntity.ok(quotes);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getQuoteStats() {
        Map<String, Object> stats = quoteService.getQuoteStats();
        return ResponseEntity.ok(stats);
    }
} 