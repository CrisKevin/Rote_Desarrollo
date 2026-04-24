package com.uatf.sistema.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PeriodoDTO {

    private UUID id;
    private String descripcion;
    private LocalDateTime desde;
    private LocalDateTime hasta;
    private UUID gestion_id;
    private String gestion_nombre;
    private UUID tipo_periodo_id;
    private String tipo_periodo_nombre;
    private LocalDateTime fecha_creacion;
    
}
