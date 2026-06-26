package com.uatf.sistema.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    PasswordEncoder codificaPass(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager autenticacion(AuthenticationConfiguration authConfig) throws Exception{
        return authConfig.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception{
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/**").hasAnyRole("ADMIN","USER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /*    SecurityFilterChain securityChain(HttpSecurity http, 
            AuthenticationManager authManager, UserDetailsService userDetailsService) throws Exception{
        http.
            csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/**").hasAnyRole("ADMIN","USER")
                .anyRequest().authenticated()
            )
            .authenticationManager(authManager)
            .userDetailsService(userDetailsService)
            .formLogin(form -> form.permitAll())
            .httpBasic(basic -> {});

        return http.build();
    } */
}
