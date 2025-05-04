package com.inventory.inventory.dto;

import com.inventory.inventory.model.InventoryItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
    
    private String id;
    private String name;
    private String category;
    private String description;
    private int quantity;
    private BigDecimal price;
    private InventoryItem.InventoryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
