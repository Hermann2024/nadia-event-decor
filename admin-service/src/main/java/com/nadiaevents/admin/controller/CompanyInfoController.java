package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.CompanyInfo;
import com.nadiaevents.admin.service.CompanyInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/company-info")
// Supprimé @CrossOrigin(origins = "*") - la configuration globale s'en charge
public class CompanyInfoController {
    
    @Autowired
    private CompanyInfoService companyInfoService;
    
    @GetMapping
    public ResponseEntity<List<CompanyInfo>> getAllCompanyInfo() {
        List<CompanyInfo> companyInfoList = companyInfoService.getAllCompanyInfo();
        return ResponseEntity.ok(companyInfoList);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CompanyInfo> getCompanyInfoById(@PathVariable Long id) {
        return companyInfoService.getCompanyInfoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/default")
    public ResponseEntity<CompanyInfo> getDefaultCompanyInfo() {
        CompanyInfo defaultInfo = companyInfoService.getDefaultCompanyInfo();
        return ResponseEntity.ok(defaultInfo);
    }
    
    @PostMapping
    public ResponseEntity<?> createCompanyInfo(@RequestBody CompanyInfo companyInfo) {
        try {
            CompanyInfo savedCompanyInfo = companyInfoService.createCompanyInfo(companyInfo);
            return ResponseEntity.ok(savedCompanyInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompanyInfo(@PathVariable Long id, @RequestBody CompanyInfo companyInfo) {
        try {
            CompanyInfo updatedCompanyInfo = companyInfoService.updateCompanyInfo(id, companyInfo);
            return ResponseEntity.ok(updatedCompanyInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompanyInfo(@PathVariable Long id) {
        try {
            companyInfoService.deleteCompanyInfo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/company/{companyName}")
    public ResponseEntity<CompanyInfo> getCompanyInfoByCompanyName(@PathVariable String companyName) {
        try {
            CompanyInfo companyInfo = companyInfoService.getCompanyInfoByCompanyName(companyName);
            return ResponseEntity.ok(companyInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
