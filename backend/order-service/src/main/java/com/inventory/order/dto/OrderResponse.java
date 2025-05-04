package com.inventory.order.dto;

import com.inventory.order.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    
    private String id;
    private String customerId;
    private String customerName;
    private LocalDateTime orderDate;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
