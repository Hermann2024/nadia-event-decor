package com.nadiaevents.admin.repository;

import com.nadiaevents.admin.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    List<Payroll> findByStaffId(Long staffId);
    
    List<Payroll> findByStatus(Payroll.PayrollStatus status);
    
    List<Payroll> findByPayPeriodStartBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.status = 'PAID' AND p.payPeriodStart BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPayrollByDateRange(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p.staff.department, SUM(p.netSalary) FROM Payroll p WHERE p.status = 'PAID' GROUP BY p.staff.department")
    List<Object[]> getPayrollByDepartment();
    
    @Query("SELECT AVG(p.netSalary) FROM Payroll p WHERE p.status = 'PAID'")
    BigDecimal getAverageSalary();
    
    @Query("SELECT p FROM Payroll p WHERE p.staff.id = :staffId AND p.payPeriodStart BETWEEN :startDate AND :endDate")
    List<Payroll> findPayrollByStaffAndDateRange(@Param("staffId") Long staffId,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payroll p WHERE p.status = 'PENDING'")
    Long countPendingPayrolls();
} 