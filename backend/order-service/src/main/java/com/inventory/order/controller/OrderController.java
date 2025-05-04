package com.inventory.order.controller;

import com.inventory.order.dto.OrderRequest;
import com.inventory.order.dto.OrderResponse;
import com.inventory.order.model.Order;
import com.inventory.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order API", description = "Endpoints for managing orders")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    @Operation(summary = "Create a new order")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest orderRequest,
            @RequestHeader("X-User-Id") String userId) {
        OrderResponse order = orderService.createOrder(orderRequest, userId);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }
    
    @GetMapping
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get orders by customer ID")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomerId(@PathVariable String customerId) {
        List<OrderResponse> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status) {
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{orderId}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam Order.OrderStatus status,
            @RequestHeader("X-User-Id") String userId) {
        OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, status, userId);
        return ResponseEntity.ok(updatedOrder);
    }
}
