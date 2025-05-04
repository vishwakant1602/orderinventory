package com.inventory.inventory.service;

import com.inventory.inventory.dto.InventoryRequest;
import com.inventory.inventory.dto.InventoryResponse;
import com.inventory.inventory.exception.InventoryNotFoundException;
import com.inventory.inventory.model.InventoryItem;
import com.inventory.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;
    
    public InventoryResponse createInventoryItem(InventoryRequest request, String userId) {
        log.info("Creating new inventory item: {}", request.getName());
        
        InventoryItem item = InventoryItem.builder()
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        item.updateStatus();
        
        InventoryItem savedItem = inventoryRepository.save(item);
        return mapToInventoryResponse(savedItem);
    }
    
    public List<InventoryResponse> getAllInventoryItems() {
        log.info("Fetching all inventory items");
        return inventoryRepository.findAll().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public InventoryResponse getInventoryItemById(String id) {
        log.info("Fetching inventory item with ID: {}", id);
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException("Inventory item not found with ID: " + id));
        return mapToInventoryResponse(item);
    }
    
    public List<InventoryResponse> getInventoryItemsByCategory(String category) {
        log.info("Fetching inventory items by category: {}", category);
        return inventoryRepository.findByCategory(category).stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public List<InventoryResponse> getInventoryItemsByStatus(InventoryItem.InventoryStatus status) {
        log.info("Fetching inventory items by status: {}", status);
        return inventoryRepository.findByStatus(status).stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public List<InventoryResponse> searchInventoryItems(String keyword) {
        log.info("Searching inventory items with keyword: {}", keyword);
        return inventoryRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public InventoryResponse updateInventoryItem(String id, InventoryRequest request, String userId) {
        log.info("Updating inventory item with ID: {}", id);
        InventoryItem existingItem = inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException("Inventory item not found with ID: " + id));
        
        existingItem.setName(request.getName());
        existingItem.setCategory(request.getCategory());
        existingItem.setDescription(request.getDescription());
        existingItem.setQuantity(request.getQuantity());
        existingItem.setPrice(request.getPrice());
        existingItem.setUpdatedAt(LocalDateTime.now());
        
        existingItem.updateStatus();
        
        InventoryItem updatedItem = inventoryRepository.save(existingItem);
        return mapToInventoryResponse(updatedItem);
    }
    
    public void updateInventoryQuantity(String id, int quantity) {
        log.info("Updating inventory quantity for item ID: {}, quantity change: {}", id, quantity);
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new InventoryNotFoundException("Inventory item not found with ID: " + id));
        
        int newQuantity = item.getQuantity() - quantity;
        if (newQuantity < 0) {
            log.warn("Insufficient inventory for item ID: {}", id);
            throw new IllegalArgumentException("Insufficient inventory for item: " + item.getName());
        }
        
        item.setQuantity(newQuantity);
        item.setUpdatedAt(LocalDateTime.now());
        item.updateStatus();
        
        inventoryRepository.save(item);
    }
    
    public void deleteInventoryItem(String id) {
        log.info("Deleting inventory item with ID: {}", id);
        if (!inventoryRepository.existsById(id)) {
            throw new InventoryNotFoundException("Inventory item not found with ID: " + id);
        }
        inventoryRepository.deleteById(id);
    }
    
    private InventoryResponse mapToInventoryResponse(InventoryItem item) {
        return InventoryResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .category(item.getCategory())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .status(item.getStatus())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
