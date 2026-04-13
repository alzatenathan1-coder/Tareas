package com.taskscape.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS (Cross-Origin Resource Sharing) configuration.
 *
 * By default, browsers block requests from one origin (e.g., localhost:5173)
 * to a different origin (e.g., localhost:8080). This config tells Spring
 * to allow our frontend to communicate with this API.
 */
@Configuration
public class CorsConfig {

    /**
     * Register CORS mappings for all API endpoints.
     *
     * This allows the frontend (running on a different port) to make
     * HTTP requests to our backend without being blocked by the browser.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")               // Apply to all /api/ endpoints
                        .allowedOrigins(
                                "http://localhost:3000",       // React default
                                "http://localhost:5173",       // Vite default
                                "http://127.0.0.1:3000",      // Alternative localhost
                                "http://127.0.0.1:5173"       // Alternative localhost
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")                  // Allow all headers
                        .allowCredentials(true)               // Allow cookies/auth headers
                        .maxAge(3600);                        // Cache preflight for 1 hour
            }
        };
    }
}
