package com.complianceagent.Pdf.Merger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all endpoints
                .allowedOrigins("http://localhost:3000") // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Adjust as needed
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}