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
                .allowedOrigins("http://localhost:5000")
                // .allowedOrigins("http://compliance-app-env.eba-42m8s3pr.ca-central-1.elasticbeanstalk.com")
                // // Allow React frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Adjust as needed
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}