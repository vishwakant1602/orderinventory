package com.inventory.inventory.repository;

import com.inventory.inventory.model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends MongoRepository<InventoryItem, String> {
    
    List<InventoryItem> findByCategory(String category);
    
    List<InventoryItem> findByStatus(InventoryItem.InventoryStatus status);
    
    List<InventoryItem> findByNameContainingIgnoreCase(String name);
    
    List<InventoryItem> findByQuantityLessThanEqual(int quantity);
}
