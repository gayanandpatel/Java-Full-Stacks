package com.shopifyy.shopifyy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopifyy.shopifyy.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);

    boolean existsByName(String name);
}
