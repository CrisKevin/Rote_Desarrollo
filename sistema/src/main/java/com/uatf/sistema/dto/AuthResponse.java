package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String username;
    private String role;
    private UUID unidad_id;
    private String unidad_nombre;
}
