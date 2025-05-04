package com.inventory.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String fullName;
    private Set<Role> roles;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum Role {
        ROLE_USER,
        ROLE_ADMIN
    }
}
