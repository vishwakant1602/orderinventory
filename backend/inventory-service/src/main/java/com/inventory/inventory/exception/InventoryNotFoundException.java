package com.inventory.inventory.exception;

public class InventoryNotFoundException extends RuntimeException {
    
    public InventoryNotFoundException(String message) {
        super(message);
    }
}
