package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.CompanyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyInfoRepository extends JpaRepository<CompanyInfo, Long> {
    
    Optional<CompanyInfo> findByCompanyName(String companyName);
    
    Optional<CompanyInfo> findFirstByOrderByIdAsc();
} 