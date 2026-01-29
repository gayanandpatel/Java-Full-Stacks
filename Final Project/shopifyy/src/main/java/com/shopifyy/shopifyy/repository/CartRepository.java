package com.shopifyy.shopifyy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopifyy.shopifyy.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUserId(Long userId);
}


