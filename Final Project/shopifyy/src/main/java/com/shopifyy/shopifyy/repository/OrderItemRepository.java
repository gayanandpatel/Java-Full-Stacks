package com.shopifyy.shopifyy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopifyy.shopifyy.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
  List<OrderItem> findByProductId(Long productId);
}


