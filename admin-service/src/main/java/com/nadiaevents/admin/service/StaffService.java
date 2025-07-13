package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.Staff;
import com.nadiaevents.admin.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StaffService {
    
    @Autowired
    private StaffRepository staffRepository;
    
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }
    
    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }
    
    public Staff createStaff(Staff staff) {
        try {
            // Validation des données
            validateStaffData(staff);
            
            // Vérifier si l'email existe déjà
            if (staffRepository.findByEmail(staff.getEmail()).isPresent()) {
                throw new RuntimeException("Un employé avec cet email existe déjà: " + staff.getEmail());
            }
            
            // Initialisation des champs par défaut
            staff.setCreatedAt(LocalDateTime.now());
            staff.setUpdatedAt(LocalDateTime.now());
            if (staff.getStatus() == null) {
                staff.setStatus(Staff.StaffStatus.ACTIVE);
            }
            if (staff.getHireDate() == null) {
                staff.setHireDate(LocalDateTime.now());
            }
            
            System.out.println("Staff reçu: " + staff);
            System.out.println("Salaire: " + staff.getSalary());
            System.out.println("Date d'embauche: " + staff.getHireDate());
            
            return staffRepository.save(staff);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création de l'employé: " + e.getMessage());
        }
    }
    
    public Staff updateStaff(Long id, Staff staff) {
        try {
            Optional<Staff> existingStaff = staffRepository.findById(id);
            if (existingStaff.isEmpty()) {
                throw new RuntimeException("Employé non trouvé avec l'id: " + id);
            }
            
            // Validation des données
            validateStaffData(staff);
            
            // Vérifier si l'email existe déjà pour un autre employé
            Optional<Staff> existingStaffWithEmail = staffRepository.findByEmail(staff.getEmail());
            if (existingStaffWithEmail.isPresent() && !existingStaffWithEmail.get().getId().equals(id)) {
                throw new RuntimeException("Un autre employé avec cet email existe déjà: " + staff.getEmail());
            }
            
            // Mise à jour des champs
            staff.setId(id);
            staff.setUpdatedAt(LocalDateTime.now());
            staff.setCreatedAt(existingStaff.get().getCreatedAt());
            
            System.out.println("Staff reçu: " + staff);
            System.out.println("Salaire: " + staff.getSalary());
            System.out.println("Date d'embauche: " + staff.getHireDate());
            
            return staffRepository.save(staff);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la mise à jour de l'employé: " + e.getMessage());
        }
    }
    
    public void deleteStaff(Long id) {
        try {
            if (!staffRepository.existsById(id)) {
                throw new RuntimeException("Employé non trouvé avec l'id: " + id);
            }
            staffRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression de l'employé: " + e.getMessage());
        }
    }
    
    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartment(department);
    }
    
    public List<Staff> getStaffByStatus(Staff.StaffStatus status) {
        return staffRepository.findByStatus(status);
    }
    
    public List<Staff> getActiveStaff() {
        return staffRepository.findByStatus(Staff.StaffStatus.ACTIVE);
    }
    
    public Map<String, Object> getStaffStats() {
        try {
            Long activeStaff = staffRepository.countByStatus(com.nadiaevents.admin.model.Staff.StaffStatus.ACTIVE);
            Double totalSalary = staffRepository.getTotalSalary();
            List<Object[]> byDepartment = staffRepository.countByDepartment();
            
            return Map.of(
                "activeStaff", activeStaff != null ? activeStaff : 0,
                "totalSalary", totalSalary != null ? totalSalary : 0.0,
                "byDepartment", byDepartment,
                "totalStaff", staffRepository.count()
            );
        } catch (Exception e) {
            return Map.of(
                "activeStaff", 0,
                "totalSalary", 0.0,
                "byDepartment", List.of(),
                "totalStaff", 0
            );
        }
    }
    
    public Map<String, Object> getDepartmentStats() {
        try {
            List<Object[]> departmentStats = staffRepository.countByDepartment();
            Double avgSalary = staffRepository.getAverageSalary();
            
            return Map.of(
                "departmentStats", departmentStats,
                "averageSalary", avgSalary != null ? avgSalary : 0.0
            );
        } catch (Exception e) {
            return Map.of(
                "departmentStats", List.of(),
                "averageSalary", 0.0
            );
        }
    }
    
    public Map<String, Object> getSalaryStats() {
        try {
            Double avgSalary = staffRepository.getAverageSalary();
            Double minSalary = staffRepository.getMinSalary();
            Double maxSalary = staffRepository.getMaxSalary();
            
            return Map.of(
                "averageSalary", avgSalary != null ? avgSalary : 0.0,
                "minSalary", minSalary != null ? minSalary : 0.0,
                "maxSalary", maxSalary != null ? maxSalary : 0.0
            );
        } catch (Exception e) {
            return Map.of(
                "averageSalary", 0.0,
                "minSalary", 0.0,
                "maxSalary", 0.0
            );
        }
    }
    
    public List<Staff> searchStaff(String query) {
        return staffRepository.searchStaff(query);
    }
    
    public List<Staff> getStaffByHireDateRange(LocalDate startDate, LocalDate endDate) {
        return staffRepository.findByHireDateBetween(startDate, endDate);
    }
    
    public Map<String, Object> getStaffTurnoverStats() {
        try {
            LocalDate oneYearAgo = LocalDate.now().minusYears(1);
            Long newHires = staffRepository.countByHireDateAfter(oneYearAgo);
            Long totalStaff = staffRepository.count();
            
            double turnoverRate = totalStaff > 0 ? (double) newHires / totalStaff * 100 : 0;
            
            return Map.of(
                "newHiresLastYear", newHires,
                "totalStaff", totalStaff,
                "turnoverRate", turnoverRate
            );
        } catch (Exception e) {
            return Map.of(
                "newHiresLastYear", 0,
                "totalStaff", 0,
                "turnoverRate", 0.0
            );
        }
    }
    
    public Map<String, Object> getStaffPerformanceMetrics() {
        try {
            Long activeStaff = staffRepository.countByStatus(com.nadiaevents.admin.model.Staff.StaffStatus.ACTIVE);
            Double avgSalary = staffRepository.getAverageSalary();
            List<Object[]> byDepartment = staffRepository.countByDepartment();
            
            // Calculer des métriques de performance
            double salaryEfficiency = avgSalary != null && activeStaff != null && activeStaff > 0 
                ? avgSalary / activeStaff : 0;
            
            return Map.of(
                "activeStaff", activeStaff != null ? activeStaff : 0,
                "averageSalary", avgSalary != null ? avgSalary : 0.0,
                "byDepartment", byDepartment,
                "salaryEfficiency", salaryEfficiency,
                "totalStaff", staffRepository.count()
            );
        } catch (Exception e) {
            return Map.of(
                "activeStaff", 0,
                "averageSalary", 0.0,
                "byDepartment", List.of(),
                "salaryEfficiency", 0.0,
                "totalStaff", 0
            );
        }
    }
    
    public Map<String, Object> getStaffCostAnalysis() {
        try {
            Double avgSalary = staffRepository.getAverageSalary();
            Long activeStaff = staffRepository.countByStatus(com.nadiaevents.admin.model.Staff.StaffStatus.ACTIVE);
            List<Object[]> byDepartment = staffRepository.countByDepartment();
            
            BigDecimal totalSalaryCost = avgSalary != null && activeStaff != null 
                ? BigDecimal.valueOf(avgSalary * activeStaff) : BigDecimal.ZERO;
            
            return Map.of(
                "averageSalary", avgSalary != null ? avgSalary : 0.0,
                "activeStaff", activeStaff != null ? activeStaff : 0,
                "totalSalaryCost", totalSalaryCost,
                "byDepartment", byDepartment
            );
        } catch (Exception e) {
            return Map.of(
                "averageSalary", 0.0,
                "activeStaff", 0,
                "totalSalaryCost", BigDecimal.ZERO,
                "byDepartment", List.of()
            );
        }
    }
    
    public List<String> getAllDepartments() {
        return staffRepository.findAll().stream()
                .map(Staff::getDepartment)
                .distinct()
                .filter(dept -> dept != null && !dept.trim().isEmpty())
                .toList();
    }
    
    public List<String> getAllPositions() {
        return staffRepository.findAll().stream()
                .map(Staff::getPosition)
                .distinct()
                .filter(pos -> pos != null && !pos.trim().isEmpty())
                .toList();
    }
    
    public Map<String, Object> getStaffBySalaryRange(BigDecimal minSalary, BigDecimal maxSalary) {
        List<Staff> staffInRange = staffRepository.findAll().stream()
                .filter(staff -> staff.getSalary() != null && 
                        staff.getSalary().compareTo(minSalary) >= 0 && 
                        staff.getSalary().compareTo(maxSalary) <= 0)
                .toList();
        
        return Map.of(
            "staffInRange", staffInRange,
            "count", staffInRange.size(),
            "minSalary", minSalary,
            "maxSalary", maxSalary
        );
    }
    
    private void validateStaffData(Staff staff) {
        if (staff.getFirstName() == null || staff.getFirstName().trim().isEmpty()) {
            throw new RuntimeException("Le prénom est obligatoire");
        }
        if (staff.getLastName() == null || staff.getLastName().trim().isEmpty()) {
            throw new RuntimeException("Le nom de famille est obligatoire");
        }
        if (staff.getEmail() == null || staff.getEmail().trim().isEmpty()) {
            throw new RuntimeException("L'email est obligatoire");
        }
        if (!isValidEmail(staff.getEmail())) {
            throw new RuntimeException("Format d'email invalide");
        }
        if (staff.getPhone() == null || staff.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Le numéro de téléphone est obligatoire");
        }
        if (staff.getPosition() == null || staff.getPosition().trim().isEmpty()) {
            throw new RuntimeException("Le poste est obligatoire");
        }
        if (staff.getDepartment() == null || staff.getDepartment().trim().isEmpty()) {
            throw new RuntimeException("Le département est obligatoire");
        }
        if (staff.getSalary() == null) {
            throw new RuntimeException("Le salaire est obligatoire");
        }
        try {
            if (staff.getSalary().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Le salaire doit être supérieur à 0");
            }
        } catch (Exception e) {
            throw new RuntimeException("Format de salaire invalide");
        }
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.contains("@") && email.contains(".");
    }
} 