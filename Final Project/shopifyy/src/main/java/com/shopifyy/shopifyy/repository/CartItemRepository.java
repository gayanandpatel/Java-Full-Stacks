package com.shopifyy.shopifyy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopifyy.shopifyy.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findByProductId(Long productId);

  void deleteAllByCartId(Long cartId);
}


