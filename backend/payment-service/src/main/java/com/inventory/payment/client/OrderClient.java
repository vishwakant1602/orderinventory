package com.inventory.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service")
public interface OrderClient {
    
    @PutMapping("/api/orders/{orderId}/payment-status")
    void updateOrderPaymentStatus(@PathVariable String orderId, @RequestParam String status);
}
