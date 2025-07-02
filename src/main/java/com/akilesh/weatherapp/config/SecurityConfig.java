package com.akilesh.weatherapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public access for React frontend build files
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/static/**",
                                "/favicon.ico",
                                "/manifest.json",
                                "/logo192.png",
                                "/logo512.png"
                        ).permitAll()

                        // Secure the API endpoints
                        .requestMatchers("/api/**").permitAll()

                        // Everything else denied
                        .anyRequest().denyAll()
                );
                //.httpBasic(); // or .formLogin() if you want a login page

        return http.build();
    }
}

