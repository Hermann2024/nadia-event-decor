package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    
    Optional<Staff> findByEmail(String email);
    
    List<Staff> findByDepartment(String department);
    
    List<Staff> findByStatus(Staff.StaffStatus status);
    
    @Query("SELECT s.department, COUNT(s) FROM Staff s GROUP BY s.department")
    List<Object[]> countByDepartment();
    
    @Query("SELECT AVG(s.salary) FROM Staff s WHERE s.status = 'ACTIVE'")
    Double getAverageSalary();
    
    @Query("SELECT MIN(s.salary) FROM Staff s WHERE s.status = 'ACTIVE'")
    Double getMinSalary();
    
    @Query("SELECT MAX(s.salary) FROM Staff s WHERE s.status = 'ACTIVE'")
    Double getMaxSalary();
    
    @Query("SELECT SUM(s.salary) FROM Staff s WHERE s.status = 'ACTIVE'")
    Double getTotalSalary();
    
    @Query("SELECT s FROM Staff s WHERE " +
           "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.position) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Staff> searchStaff(@Param("query") String query);
    
    List<Staff> findByHireDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(s) FROM Staff s WHERE s.hireDate >= :date")
    Long countByHireDateAfter(@Param("date") LocalDate date);

    long countByStatus(Staff.StaffStatus status);

    @Query("SELECT COUNT(s) FROM Staff s WHERE s.status = ?1 AND s.createdAt >= ?2")
    Long countByStatusAndCreatedAtAfter(Staff.StaffStatus status, LocalDateTime date);
} 