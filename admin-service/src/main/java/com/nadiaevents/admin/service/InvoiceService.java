package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.Invoice;
import com.nadiaevents.admin.model.CompanyInfo;
import com.nadiaevents.admin.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private CompanyInfoService companyInfoService;
    
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
    
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }
    
    public Invoice createInvoice(Invoice invoice) {
        validateInvoice(invoice);
        
        // Définir les informations de la société par défaut si non spécifiées
        if (invoice.getCompanyInfoId() == null) {
            CompanyInfo defaultCompany = companyInfoService.getDefaultCompanyInfo();
            invoice.setCompanyInfoId(defaultCompany.getId());
        }
        
        // Générer le numéro de facture si non fourni
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber(generateInvoiceNumber());
        }
        
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        if (invoice.getStatus() == null) {
            invoice.setStatus(Invoice.InvoiceStatus.DRAFT);
        }
        
        return invoiceRepository.save(invoice);
    }
    
    public Invoice updateInvoice(Long id, Invoice invoice) {
        Optional<Invoice> existingInvoice = invoiceRepository.findById(id);
        if (existingInvoice.isEmpty()) {
            throw new RuntimeException("Invoice not found with id: " + id);
        }
        
        validateInvoice(invoice);
        
        invoice.setId(id);
        invoice.setUpdatedAt(LocalDateTime.now());
        invoice.setCreatedAt(existingInvoice.get().getCreatedAt());
        
        return invoiceRepository.save(invoice);
    }
    
    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new RuntimeException("Invoice not found with id: " + id);
        }
        invoiceRepository.deleteById(id);
    }
    
    public List<Invoice> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }
    
    public List<Invoice> getInvoicesByClientName(String clientName) {
        return invoiceRepository.findByClientNameContainingIgnoreCase(clientName);
    }
    
    public Map<String, Object> getInvoiceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les factures par statut
        long totalInvoices = invoiceRepository.count();
        long paidInvoices = invoiceRepository.countByStatus(Invoice.InvoiceStatus.PAID);
        long pendingInvoices = invoiceRepository.countByStatus(Invoice.InvoiceStatus.SENT);
        long overdueInvoices = invoiceRepository.countByStatus(Invoice.InvoiceStatus.OVERDUE);
        
        // Utiliser les nouvelles méthodes du repository
        BigDecimal totalRevenue = invoiceRepository.getTotalRevenue();
        BigDecimal pendingRevenue = invoiceRepository.getPendingRevenue();
        
        stats.put("totalInvoices", totalInvoices);
        stats.put("paidInvoices", paidInvoices);
        stats.put("pendingInvoices", pendingInvoices);
        stats.put("overdueInvoices", overdueInvoices);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingRevenue", pendingRevenue);
        
        return stats;
    }
    
    public Map<String, Object> getInvoiceWithCompanyInfo(Long invoiceId) {
        Optional<Invoice> invoice = invoiceRepository.findById(invoiceId);
        if (invoice.isEmpty()) {
            throw new RuntimeException("Invoice not found with id: " + invoiceId);
        }
        
        CompanyInfo companyInfo = companyInfoService.getCompanyInfoById(invoice.get().getCompanyInfoId())
                .orElse(companyInfoService.getDefaultCompanyInfo());
        
        return Map.of(
            "invoice", invoice.get(),
            "companyInfo", companyInfo
        );
    }
    
    private void validateInvoice(Invoice invoice) {
        if (invoice.getClientName() == null || invoice.getClientName().trim().isEmpty()) {
            throw new RuntimeException("Client name is required");
        }
        // Permettre les montants nuls pour les brouillons
        if (invoice.getTotalAmount() == null) {
            invoice.setTotalAmount(BigDecimal.ZERO);
        }
    }
    
    private String generateInvoiceNumber() {
        return "INV-" + System.currentTimeMillis();
    }
} 