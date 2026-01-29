package com.shopifyy.shopifyy.service.order;

import java.util.List;

import com.shopifyy.shopifyy.dtos.OrderDto;
import com.shopifyy.shopifyy.model.Order;
import com.shopifyy.shopifyy.request.PaymentRequest;
import com.stripe.exception.StripeException;

public interface IOrderService {
    Order placeOrder(Long userId);
    List<OrderDto> getUserOrders(Long userId);


    String createPaymentIntent(PaymentRequest request) throws StripeException;

    OrderDto convertToDto(Order order);
}
