package com.inventory.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI inventoryServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Inventory Service API")
                        .description("API for managing inventory items in the Order Inventory System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Order Inventory System Team")
                                .email("support@orderinventory.com")));
    }
}
