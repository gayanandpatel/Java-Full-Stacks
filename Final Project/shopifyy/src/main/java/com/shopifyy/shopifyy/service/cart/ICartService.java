package com.shopifyy.shopifyy.service.cart;

import java.math.BigDecimal;

import com.shopifyy.shopifyy.dtos.CartDto;
import com.shopifyy.shopifyy.model.Cart;
import com.shopifyy.shopifyy.model.User;

public interface ICartService {
    Cart getCart(Long cartId);

    Cart getCartByUserId(Long userId);

    void clearCart(Long cartId);

    Cart initializeNewCartForUser(User user);

    BigDecimal getTotalPrice(Long cartId);

    CartDto convertToDto(Cart cart);
}