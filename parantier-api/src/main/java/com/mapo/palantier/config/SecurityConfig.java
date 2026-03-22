package com.mapo.palantier.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Actuator health endpoint - 인증 없이 접근 가능 (헬스체크용)
                .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                // Swagger UI - 인증 없이 접근 가능 (개발 편의성)
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                // Auth endpoints - 회원가입/로그인/이메일 중복 체크는 인증 없이 접근 가능
                .requestMatchers("/api/auth/signup", "/api/auth/login", "/api/auth/check-email").permitAll()
                // 나머지 Actuator endpoints - 인증 필요
                .requestMatchers("/actuator/**").authenticated()
                // 나머지 API endpoints - 인증 필요
                .requestMatchers("/api/**").authenticated()
                // 기타 모든 요청 - 인증 필요
                .anyRequest().authenticated()
            )
            // JWT 인증 필터 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
