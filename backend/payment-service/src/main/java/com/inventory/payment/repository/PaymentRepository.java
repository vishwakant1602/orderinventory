package com.inventory.payment.repository;

import com.inventory.payment.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    
    Optional<Payment> findByOrderId(String orderId);
    
    List<Payment> findByCustomerId(String customerId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
}
