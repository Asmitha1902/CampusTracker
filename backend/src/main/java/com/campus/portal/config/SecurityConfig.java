package com.campus.portal.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ❌ Disable CSRF
            .csrf(csrf -> csrf.disable())

            // ✅ Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 🔐 Authorization rules
            .authorizeHttpRequests(auth -> auth

                // ✅ Preflight (CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ✅ AUTH APIs (REGISTER + LOGIN)
                .requestMatchers("/api/auth/**").permitAll()

                // ✅ ADMIN APIs
                .requestMatchers("/api/admin/**").permitAll()
                .requestMatchers("/api/reports").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/items/approve/**").permitAll()
    .requestMatchers(HttpMethod.PUT, "/api/items/reject/**").permitAll()

                // ✅ PUBLIC APIs
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/items/**").permitAll()

                // 🔒 PROTECTED APIs
                .requestMatchers("/api/items/my-posts").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/items/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/items/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/items/**").authenticated()

                // बाकी सब protected
                .anyRequest().authenticated()
            )

            // ❌ Disable default login UI
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable())

            // ✅ ✅ IMPORTANT: SESSION BASED (FIX)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    // 🌍 CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // ✅ REQUIRED for session

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}