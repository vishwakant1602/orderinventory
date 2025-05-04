package com.inventory.payment.dto;

import com.inventory.payment.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    @NotBlank(message = "Customer ID is required")
    private String customerId;
    
    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount cannot be negative")
    private BigDecimal amount;
    
    @NotNull(message = "Payment method is required")
    private Payment.PaymentMethod paymentMethod;
    
    private String paymentGateway;
}
