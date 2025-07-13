package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.Quote;
import com.nadiaevents.admin.model.CompanyInfo;
import com.nadiaevents.admin.repository.QuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
public class QuoteService {
    
    @Autowired
    private QuoteRepository quoteRepository;
    
    @Autowired
    private CompanyInfoService companyInfoService;
    
    public List<Quote> getAllQuotes() {
        return quoteRepository.findAll();
    }
    
    public Optional<Quote> getQuoteById(Long id) {
        return quoteRepository.findById(id);
    }
    
    public Quote createQuote(Quote quote) {
        validateQuote(quote);
        
        // Définir les informations de la société par défaut si non spécifiées
        if (quote.getCompanyInfoId() == null) {
            CompanyInfo defaultCompany = companyInfoService.getDefaultCompanyInfo();
            quote.setCompanyInfoId(defaultCompany.getId());
        }
        
        // Générer le numéro de devis si non fourni
        if (quote.getQuoteNumber() == null || quote.getQuoteNumber().isEmpty()) {
            quote.setQuoteNumber(generateQuoteNumber());
        }
        
        quote.setCreatedAt(LocalDateTime.now());
        quote.setUpdatedAt(LocalDateTime.now());
        if (quote.getStatus() == null) {
            quote.setStatus(Quote.QuoteStatus.DRAFT);
        }
        
        return quoteRepository.save(quote);
    }
    
    public Quote updateQuote(Long id, Quote quote) {
        Optional<Quote> existingQuote = quoteRepository.findById(id);
        if (existingQuote.isEmpty()) {
            throw new RuntimeException("Quote not found with id: " + id);
        }
        
        validateQuote(quote);
        
        quote.setId(id);
        quote.setUpdatedAt(LocalDateTime.now());
        quote.setCreatedAt(existingQuote.get().getCreatedAt());
        
        return quoteRepository.save(quote);
    }
    
    public void deleteQuote(Long id) {
        if (!quoteRepository.existsById(id)) {
            throw new RuntimeException("Quote not found with id: " + id);
        }
        quoteRepository.deleteById(id);
    }
    
    public List<Quote> getQuotesByStatus(Quote.QuoteStatus status) {
        return quoteRepository.findByStatus(status);
    }
    
    public List<Quote> getQuotesByClientName(String clientName) {
        return quoteRepository.findByClientNameContainingIgnoreCase(clientName);
    }
    
    public Map<String, Object> getQuoteStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les devis par statut
        long totalQuotes = quoteRepository.count();
        long acceptedQuotes = quoteRepository.countByStatus(Quote.QuoteStatus.ACCEPTED);
        long pendingQuotes = quoteRepository.countByStatus(Quote.QuoteStatus.SENT);
        long rejectedQuotes = quoteRepository.countByStatus(Quote.QuoteStatus.REJECTED);
        
        // Utiliser les nouvelles méthodes du repository
        BigDecimal totalValue = quoteRepository.getTotalValue();
        BigDecimal acceptedValue = quoteRepository.getAcceptedValue();
        
        stats.put("totalQuotes", totalQuotes);
        stats.put("acceptedQuotes", acceptedQuotes);
        stats.put("pendingQuotes", pendingQuotes);
        stats.put("rejectedQuotes", rejectedQuotes);
        stats.put("totalValue", totalValue);
        stats.put("acceptedValue", acceptedValue);
        
        return stats;
    }
    
    public Map<String, Object> getQuoteWithCompanyInfo(Long quoteId) {
        Optional<Quote> quote = quoteRepository.findById(quoteId);
        if (quote.isEmpty()) {
            throw new RuntimeException("Quote not found with id: " + quoteId);
        }
        
        CompanyInfo companyInfo = companyInfoService.getCompanyInfoById(quote.get().getCompanyInfoId())
                .orElse(companyInfoService.getDefaultCompanyInfo());
        
        return Map.of(
            "quote", quote.get(),
            "companyInfo", companyInfo
        );
    }
    
    private void validateQuote(Quote quote) {
        if (quote.getClientName() == null || quote.getClientName().trim().isEmpty()) {
            throw new RuntimeException("Client name is required");
        }
        if (quote.getTotalAmount() == null || quote.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Total amount must be greater than 0");
        }
    }
    
    private String generateQuoteNumber() {
        return "QUO-" + System.currentTimeMillis();
    }
} 