package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.CompanyInfo;
import com.nadiaevents.admin.repository.CompanyInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyInfoService {
    
    @Autowired
    private CompanyInfoRepository companyInfoRepository;
    
    public List<CompanyInfo> getAllCompanyInfo() {
        return companyInfoRepository.findAll();
    }
    
    public Optional<CompanyInfo> getCompanyInfoById(Long id) {
        return companyInfoRepository.findById(id);
    }
    
    public CompanyInfo getDefaultCompanyInfo() {
        return companyInfoRepository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultCompanyInfo);
    }
    
    public CompanyInfo createCompanyInfo(CompanyInfo companyInfo) {
        validateCompanyInfo(companyInfo);
        
        companyInfo.setCreatedAt(LocalDateTime.now());
        companyInfo.setUpdatedAt(LocalDateTime.now());
        
        return companyInfoRepository.save(companyInfo);
    }
    
    public CompanyInfo updateCompanyInfo(Long id, CompanyInfo companyInfo) {
        Optional<CompanyInfo> existingCompanyInfo = companyInfoRepository.findById(id);
        if (existingCompanyInfo.isEmpty()) {
            throw new RuntimeException("Company info not found with id: " + id);
        }
        
        validateCompanyInfo(companyInfo);
        
        companyInfo.setId(id);
        companyInfo.setUpdatedAt(LocalDateTime.now());
        companyInfo.setCreatedAt(existingCompanyInfo.get().getCreatedAt());
        
        return companyInfoRepository.save(companyInfo);
    }
    
    public void deleteCompanyInfo(Long id) {
        if (!companyInfoRepository.existsById(id)) {
            throw new RuntimeException("Company info not found with id: " + id);
        }
        companyInfoRepository.deleteById(id);
    }
    
    public CompanyInfo getCompanyInfoByCompanyName(String companyName) {
        return companyInfoRepository.findByCompanyName(companyName)
                .orElseThrow(() -> new RuntimeException("Company info not found for company: " + companyName));
    }
    
    private CompanyInfo createDefaultCompanyInfo() {
        CompanyInfo defaultInfo = new CompanyInfo();
        defaultInfo.setCompanyName("Nadia Event's Decor");
        defaultInfo.setLegalName("Nadia Event's Decor SARL");
        defaultInfo.setSlogan("Créons ensemble vos moments inoubliables");
        defaultInfo.setAddress("123 Rue de l'Événement");
        defaultInfo.setCity("Douala");
        defaultInfo.setPostalCode("237");
        defaultInfo.setCountry("Cameroun");
        defaultInfo.setPhone("+237 123 456 789");
        defaultInfo.setEmail("contact@nadiaevents.com");
        defaultInfo.setWebsite("www.nadiaevents.com");
        defaultInfo.setTaxNumber("TAX123456789");
        defaultInfo.setRegistrationNumber("REG123456789");
        defaultInfo.setHeaderColor("#2C3E50");
        defaultInfo.setFooterText("Merci de votre confiance");
        
        return createCompanyInfo(defaultInfo);
    }
    
    private void validateCompanyInfo(CompanyInfo companyInfo) {
        if (companyInfo.getCompanyName() == null || companyInfo.getCompanyName().trim().isEmpty()) {
            throw new RuntimeException("Company name is required");
        }
        if (companyInfo.getEmail() == null || companyInfo.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (companyInfo.getPhone() == null || companyInfo.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Phone is required");
        }
    }
} 