package com.inventory.order.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    
    @Id
    private String id;
    private String customerId;
    private String customerName;
    private LocalDateTime orderDate;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PROCESSING,
        SHIPPED,
        COMPLETED,
        CANCELLED
    }
}
