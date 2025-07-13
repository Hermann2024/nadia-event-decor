package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.Invoice;
import com.nadiaevents.admin.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/invoices")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class InvoiceController {
    
    @Autowired
    private InvoiceService invoiceService;
    
    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        List<Invoice> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/with-company-info")
    public ResponseEntity<Map<String, Object>> getInvoiceWithCompanyInfo(@PathVariable Long id) {
        try {
            Map<String, Object> result = invoiceService.getInvoiceWithCompanyInfo(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody Invoice invoice) {
        try {
            Invoice savedInvoice = invoiceService.createInvoice(invoice);
            return ResponseEntity.ok(savedInvoice);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoice) {
        try {
            Invoice updatedInvoice = invoiceService.updateInvoice(id, invoice);
            return ResponseEntity.ok(updatedInvoice);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Invoice>> getInvoicesByStatus(@PathVariable Invoice.InvoiceStatus status) {
        List<Invoice> invoices = invoiceService.getInvoicesByStatus(status);
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/client/{clientName}")
    public ResponseEntity<List<Invoice>> getInvoicesByClientName(@PathVariable String clientName) {
        List<Invoice> invoices = invoiceService.getInvoicesByClientName(clientName);
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInvoiceStats() {
        Map<String, Object> stats = invoiceService.getInvoiceStats();
        return ResponseEntity.ok(stats);
    }
} 