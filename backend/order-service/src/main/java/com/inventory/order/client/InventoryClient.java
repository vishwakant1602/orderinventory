package com.inventory.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "inventory-service")
public interface InventoryClient {
    
    @PutMapping("/api/inventory/{productId}/quantity")
    void updateInventory(@PathVariable String productId, @RequestParam int quantity);
}
