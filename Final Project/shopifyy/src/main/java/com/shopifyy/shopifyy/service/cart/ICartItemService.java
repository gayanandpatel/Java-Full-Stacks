package com.shopifyy.shopifyy.service.cart;

import com.shopifyy.shopifyy.dtos.CartItemDto;
import com.shopifyy.shopifyy.model.CartItem;

public interface ICartItemService {
    CartItem addItemToCart(Long cartId, Long productId, int quantity);
    void removeItemFromCart(Long cartId, Long productId);
    void updateItemQuantity(Long cartId, Long productId, int quantity);
    CartItem getCartItem(Long cartId, Long productId);

    CartItemDto convertToDto(CartItem cartItem);
}
