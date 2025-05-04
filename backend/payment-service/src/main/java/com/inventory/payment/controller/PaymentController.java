package com.inventory.payment.controller;

import com.inventory.payment.dto.PaymentRequest;
import com.inventory.payment.dto.PaymentResponse;
import com.inventory.payment.model.Payment;
import com.inventory.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payment API", description = "Endpoints for managing payments")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @PostMapping
    @Operation(summary = "Process a new payment")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @RequestHeader("X-User-Id") String userId) {
        PaymentResponse payment = paymentService.processPayment(request, userId);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable String id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment by order ID")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable String orderId) {
        PaymentResponse payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get payments by customer ID")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByCustomerId(@PathVariable String customerId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByCustomerId(customerId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(
            @PathVariable Payment.PaymentStatus status) {
        List<PaymentResponse> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update payment status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable String id,
            @RequestParam Payment.PaymentStatus status) {
        PaymentResponse updatedPayment = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(updatedPayment);
    }
    
    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund a payment")
    public ResponseEntity<PaymentResponse> refundPayment(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        PaymentResponse refundedPayment = paymentService.refundPayment(id, userId);
        return ResponseEntity.ok(refundedPayment);
    }
}
