package com.shopifyy.shopifyy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopifyy.shopifyy.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductId(Long id);
}


