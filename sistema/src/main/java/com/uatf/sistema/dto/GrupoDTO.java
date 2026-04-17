package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GrupoDTO {
    private UUID id;
    private String grupo;
    private String descripcion;
    
}
