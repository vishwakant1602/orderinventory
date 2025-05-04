package com.inventory.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String id;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;
    private String token;
}
