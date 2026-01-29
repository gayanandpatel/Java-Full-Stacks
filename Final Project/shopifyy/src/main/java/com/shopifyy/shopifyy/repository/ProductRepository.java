package com.shopifyy.shopifyy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shopifyy.shopifyy.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByCategoryNameAndBrand(String category, String brand);

  List<Product> findByCategoryName(String category);

  List<Product> findByNameAndBrand(String brand, String name);

  @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
  List<Product> findByName(String name);

  List<Product> findByBrand(String brand);

  boolean existsByNameAndBrand(String name, String brand);

  List<Product> findAllByCategoryId(Long categoryId);

/* New methods for the visual search implementation */
  @Query("SELECT p FROM Product p WHERE " +
          "LOWER(p.name) LIKE LOWER(CONCAT('%',:query, '%'))  OR " +
          "LOWER(p.brand) LIKE LOWER(CONCAT('%',:query, '%')) OR " +
          "LOWER(p.description) LIKE LOWER(CONCAT('%',:query, '%'))")
  List<Product> searchProducts(@Param("query") String query);

  @Query("SELECT DISTINCT p FROM Product p JOIN p.images i JOIN i.visualTags vtag" +
          " WHERE LOWER(vtag.tag) LIKE %:label%")
  List<Product> findProductsByVisualTag(@Param("label") String label);
}


