package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    
    List<Quote> findByStatus(Quote.QuoteStatus status);
    
    List<Quote> findByClientNameContainingIgnoreCase(String clientName);
    
    @Query("SELECT COUNT(q) FROM Quote q WHERE q.status = ?1")
    Long countByStatus(Quote.QuoteStatus status);
    
    List<Quote> findTop5ByOrderByCreatedAtDesc();
    
    // Méthodes pour les statistiques
    @Query("SELECT COALESCE(SUM(q.totalAmount), 0) FROM Quote q")
    BigDecimal getTotalValue();
    
    @Query("SELECT COALESCE(SUM(q.totalAmount), 0) FROM Quote q WHERE q.status = 'ACCEPTED'")
    BigDecimal getAcceptedValue();

    @Query("SELECT COUNT(q) FROM Quote q WHERE q.createdAt >= ?1")
    Long countByCreatedAtAfter(LocalDateTime date);
} 