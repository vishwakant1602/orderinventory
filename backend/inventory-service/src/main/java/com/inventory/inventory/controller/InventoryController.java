package com.inventory.inventory.controller;

import com.inventory.inventory.dto.InventoryRequest;
import com.inventory.inventory.dto.InventoryResponse;
import com.inventory.inventory.model.InventoryItem;
import com.inventory.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory API", description = "Endpoints for managing inventory items")
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    @PostMapping
    @Operation(summary = "Create a new inventory item")
    public ResponseEntity<InventoryResponse> createInventoryItem(
            @Valid @RequestBody InventoryRequest request,
            @RequestHeader("X-User-Id") String userId) {
        InventoryResponse response = inventoryService.createInventoryItem(request, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    @Operation(summary = "Get all inventory items")
    public ResponseEntity<List<InventoryResponse>> getAllInventoryItems() {
        List<InventoryResponse> items = inventoryService.getAllInventoryItems();
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get inventory item by ID")
    public ResponseEntity<InventoryResponse> getInventoryItemById(@PathVariable String id) {
        InventoryResponse item = inventoryService.getInventoryItemById(id);
        return ResponseEntity.ok(item);
    }
    
    @GetMapping("/category/{category}")
    @Operation(summary = "Get inventory items by category")
    public ResponseEntity<List<InventoryResponse>> getInventoryItemsByCategory(@PathVariable String category) {
        List<InventoryResponse> items = inventoryService.getInventoryItemsByCategory(category);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get inventory items by status")
    public ResponseEntity<List<InventoryResponse>> getInventoryItemsByStatus(
            @PathVariable InventoryItem.InventoryStatus status) {
        List<InventoryResponse> items = inventoryService.getInventoryItemsByStatus(status);
        return ResponseEntity.ok(items);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search inventory items by name")
    public ResponseEntity<List<InventoryResponse>> searchInventoryItems(@RequestParam String keyword) {
        List<InventoryResponse> items = inventoryService.searchInventoryItems(keyword);
        return ResponseEntity.ok(items);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an inventory item")
    public ResponseEntity<InventoryResponse> updateInventoryItem(
            @PathVariable String id,
            @Valid @RequestBody InventoryRequest request,
            @RequestHeader("X-User-Id") String userId) {
        InventoryResponse updatedItem = inventoryService.updateInventoryItem(id, request, userId);
        return ResponseEntity.ok(updatedItem);
    }
    
    @PutMapping("/{id}/quantity")
    @Operation(summary = "Update inventory quantity")
    public ResponseEntity<Void> updateInventoryQuantity(
            @PathVariable String id,
            @RequestParam int quantity) {
        inventoryService.updateInventoryQuantity(id, quantity);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inventory item")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable String id) {
        inventoryService.deleteInventoryItem(id);
        return ResponseEntity.noContent().build();
    }
}
