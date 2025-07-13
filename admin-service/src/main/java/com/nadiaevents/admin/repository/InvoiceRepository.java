package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    
    List<Invoice> findByClientNameContainingIgnoreCase(String clientName);
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = ?1")
    Long countByStatus(Invoice.InvoiceStatus status);
    
    List<Invoice> findTop5ByOrderByCreatedAtDesc();
    
    // ✅ MÉTHODES POUR LES STATISTIQUES
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status = 'SENT'")
    BigDecimal getPendingRevenue();
    
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.status = 'PAID'")
    BigDecimal getPaidRevenue();
} 