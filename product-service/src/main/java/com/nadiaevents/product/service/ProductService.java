package com.nadiaevents.product.service;

import com.nadiaevents.product.model.Product;
import com.nadiaevents.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getAvailableProducts() {
        return productRepository.findByAvailableTrue();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndAvailableTrue(category);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.searchByKeyword(keyword);
    }
    
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }
    
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    public List<Product> getProductsByDailyRateRange(BigDecimal minRate, BigDecimal maxRate) {
        return productRepository.findByDailyRateBetween(minRate, maxRate);
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setDailyRate(productDetails.getDailyRate());
            product.setCategory(productDetails.getCategory());
            product.setImageUrl(productDetails.getImageUrl());
            product.setAvailable(productDetails.getAvailable());
            product.setQuantity(productDetails.getQuantity());
            product.setSpecifications(productDetails.getSpecifications());
            product.setDimensions(productDetails.getDimensions());
            product.setColor(productDetails.getColor());
            product.setMaterial(productDetails.getMaterial());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found with id: " + id);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public void updateProductAvailability(Long id, boolean available) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setAvailable(available);
            productRepository.save(product);
        }
    }
    
    public void updateProductQuantity(Long id, Integer quantity) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setQuantity(quantity);
            productRepository.save(product);
        }
    }
} 