package com.inventory.inventory.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "inventory")
public class InventoryItem {
    
    @Id
    private String id;
    private String name;
    private String category;
    private String description;
    private int quantity;
    private BigDecimal price;
    private InventoryStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum InventoryStatus {
        IN_STOCK,
        LOW_STOCK,
        OUT_OF_STOCK
    }
    
    // Update status based on quantity
    public void updateStatus() {
        if (quantity <= 0) {
            this.status = InventoryStatus.OUT_OF_STOCK;
        } else if (quantity <= 10) {
            this.status = InventoryStatus.LOW_STOCK;
        } else {
            this.status = InventoryStatus.IN_STOCK;
        }
    }
}
