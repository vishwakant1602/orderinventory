package com.inventory.order.service;

import com.inventory.order.client.InventoryClient;
import com.inventory.order.dto.OrderItemDto;
import com.inventory.order.dto.OrderRequest;
import com.inventory.order.dto.OrderResponse;
import com.inventory.order.exception.OrderNotFoundException;
import com.inventory.order.model.Order;
import com.inventory.order.model.OrderItem;
import com.inventory.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    
    public OrderResponse createOrder(OrderRequest orderRequest, String userId) {
        log.info("Creating new order for customer: {}", orderRequest.getCustomerId());
        
        // Convert OrderItemDto to OrderItem
        List<OrderItem> orderItems = orderRequest.getItems().stream()
                .map(this::mapToOrderItem)
                .collect(Collectors.toList());
        
        // Calculate total amount
        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Create order
        Order order = Order.builder()
                .id("ORD-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(orderRequest.getCustomerId())
                .customerName(orderRequest.getCustomerName())
                .orderDate(LocalDateTime.now())
                .items(orderItems)
                .totalAmount(totalAmount)
                .status(Order.OrderStatus.PROCESSING)
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Update inventory (in a real application, this would be done with a transaction or saga pattern)
        try {
            orderItems.forEach(item -> 
                inventoryClient.updateInventory(item.getProductId(), item.getQuantity()));
        } catch (Exception e) {
            log.error("Failed to update inventory: {}", e.getMessage());
            // In a real application, you would implement compensation logic here
        }
        
        return mapToOrderResponse(savedOrder);
    }
    
    public List<OrderResponse> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(String orderId) {
        log.info("Fetching order with ID: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        return mapToOrderResponse(order);
    }
    
    public List<OrderResponse> getOrdersByCustomerId(String customerId) {
        log.info("Fetching orders for customer: {}", customerId);
        return orderRepository.findByCustomerId(customerId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getOrdersByStatus(Order.OrderStatus status) {
        log.info("Fetching orders with status: {}", status);
        return orderRepository.findByStatus(status).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse updateOrderStatus(String orderId, Order.OrderStatus status, String userId) {
        log.info("Updating order {} status to {}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        Order updatedOrder = orderRepository.save(order);
        return mapToOrderResponse(updatedOrder);
    }
    
    private OrderItem mapToOrderItem(OrderItemDto dto) {
        return OrderItem.builder()
                .productId(dto.getProductId())
                .productName(dto.getProductName())
                .quantity(dto.getQuantity())
                .unitPrice(dto.getUnitPrice())
                .subtotal(dto.getUnitPrice().multiply(BigDecimal.valueOf(dto.getQuantity())))
                .build();
    }
    
    private OrderItemDto mapToOrderItemDto(OrderItem item) {
        return OrderItemDto.builder()
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .build();
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .customerId(order.getCustomerId())
                .customerName(order.getCustomerName())
                .orderDate(order.getOrderDate())
                .items(order.getItems().stream()
                        .map(this::mapToOrderItemDto)
                        .collect(Collectors.toList()))
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
