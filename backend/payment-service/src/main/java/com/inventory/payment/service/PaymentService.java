package com.inventory.payment.service;

import com.inventory.payment.client.OrderClient;
import com.inventory.payment.dto.PaymentRequest;
import com.inventory.payment.dto.PaymentResponse;
import com.inventory.payment.exception.PaymentNotFoundException;
import com.inventory.payment.model.Payment;
import com.inventory.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;
    
    public PaymentResponse processPayment(PaymentRequest request, String userId) {
        log.info("Processing payment for order: {}", request.getOrderId());
        
        // Generate a unique transaction ID
        String transactionId = UUID.randomUUID().toString();
        
        // Create payment record
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .customerId(request.getCustomerId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(Payment.PaymentStatus.PROCESSING)
                .transactionId(transactionId)
                .paymentGateway(request.getPaymentGateway())
                .paymentDate(LocalDateTime.now())
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Simulate payment processing
        simulatePaymentProcessing(savedPayment);
        
        return mapToPaymentResponse(savedPayment);
    }
    
    private void simulatePaymentProcessing(Payment payment) {
        // In a real application, this would integrate with a payment gateway
        // For demo purposes, we'll just simulate success with a small delay
        try {
            Thread.sleep(1000); // Simulate processing delay
            
            // Simulate 90% success rate
            if (Math.random() < 0.9) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                
                // Update order status
                try {
                    orderClient.updateOrderPaymentStatus(payment.getOrderId(), "PAID");
                } catch (Exception e) {
                    log.error("Failed to update order payment status: {}", e.getMessage());
                }
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
            }
            
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment processing interrupted: {}", e.getMessage());
        }
    }
    
    public PaymentResponse getPaymentById(String id) {
        log.info("Fetching payment with ID: {}", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + id));
        return mapToPaymentResponse(payment);
    }
    
    public PaymentResponse getPaymentByOrderId(String orderId) {
        log.info("Fetching payment for order: {}", orderId);
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found for order ID: " + orderId));
        return mapToPaymentResponse(payment);
    }
    
    public List<PaymentResponse> getPaymentsByCustomerId(String customerId) {
        log.info("Fetching payments for customer: {}", customerId);
        return paymentRepository.findByCustomerId(customerId).stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }
    
    public List<PaymentResponse> getPaymentsByStatus(Payment.PaymentStatus status) {
        log.info("Fetching payments with status: {}", status);
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }
    
    public PaymentResponse updatePaymentStatus(String id, Payment.PaymentStatus status) {
        log.info("Updating payment {} status to {}", id, status);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + id));
        
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        
        Payment updatedPayment = paymentRepository.save(payment);
        
        // If payment is completed, update order status
        if (status == Payment.PaymentStatus.COMPLETED) {
            try {
                orderClient.updateOrderPaymentStatus(payment.getOrderId(), "PAID");
            } catch (Exception e) {
                log.error("Failed to update order payment status: {}", e.getMessage());
            }
        }
        
        return mapToPaymentResponse(updatedPayment);
    }
    
    public PaymentResponse refundPayment(String id, String userId) {
        log.info("Processing refund for payment: {}", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + id));
        
        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }
        
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());
        
        Payment updatedPayment = paymentRepository.save(payment);
        
        // Update order status
        try {
            orderClient.updateOrderPaymentStatus(payment.getOrderId(), "REFUNDED");
        } catch (Exception e) {
            log.error("Failed to update order payment status: {}", e.getMessage());
        }
        
        return mapToPaymentResponse(updatedPayment);
    }
    
    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .customerId(payment.getCustomerId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentGateway(payment.getPaymentGateway())
                .paymentDate(payment.getPaymentDate())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
