package com.nadiaevents.product.repository;

import com.nadiaevents.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategory(String category);
    
    List<Product> findByAvailableTrue();
    
    List<Product> findByCategoryAndAvailableTrue(String category);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findAllCategories();
    
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Product> findByDailyRateBetween(BigDecimal minRate, BigDecimal maxRate);
} 