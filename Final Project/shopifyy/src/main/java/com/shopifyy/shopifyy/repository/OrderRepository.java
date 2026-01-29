package com.shopifyy.shopifyy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopifyy.shopifyy.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}


