package com.nadiaevents.admin.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "company_info")
public class CompanyInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Column(name = "legal_name")
    private String legalName;
    
    @Column(name = "slogan")
    private String slogan;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "postal_code")
    private String postalCode;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "website")
    private String website;
    
    @Column(name = "tax_number")
    private String taxNumber;
    
    @Column(name = "registration_number")
    private String registrationNumber;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Column(name = "header_color")
    private String headerColor;
    
    @Column(name = "footer_text")
    private String footerText;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public CompanyInfo() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getLegalName() {
        return legalName;
    }
    
    public void setLegalName(String legalName) {
        this.legalName = legalName;
    }
    
    public String getSlogan() {
        return slogan;
    }
    
    public void setSlogan(String slogan) {
        this.slogan = slogan;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getPostalCode() {
        return postalCode;
    }
    
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getWebsite() {
        return website;
    }
    
    public void setWebsite(String website) {
        this.website = website;
    }
    
    public String getTaxNumber() {
        return taxNumber;
    }
    
    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
    
    public String getLogoUrl() {
        return logoUrl;
    }
    
    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
    
    public String getHeaderColor() {
        return headerColor;
    }
    
    public void setHeaderColor(String headerColor) {
        this.headerColor = headerColor;
    }
    
    public String getFooterText() {
        return footerText;
    }
    
    public void setFooterText(String footerText) {
        this.footerText = footerText;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Méthode utilitaire pour obtenir l'adresse complète
    public String getFullAddress() {
        StringBuilder fullAddress = new StringBuilder();
        if (address != null && !address.trim().isEmpty()) {
            fullAddress.append(address);
        }
        if (city != null && !city.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(", ");
            fullAddress.append(city);
        }
        if (postalCode != null && !postalCode.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(" ");
            fullAddress.append(postalCode);
        }
        if (country != null && !country.trim().isEmpty()) {
            if (fullAddress.length() > 0) fullAddress.append(", ");
            fullAddress.append(country);
        }
        return fullAddress.toString();
    }
} 