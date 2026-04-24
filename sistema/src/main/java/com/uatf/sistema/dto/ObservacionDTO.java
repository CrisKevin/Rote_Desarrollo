package com.uatf.sistema.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ObservacionDTO {
    private UUID id;
    private String descripcion;
    private LocalDateTime desde;
    private LocalDateTime hasta;
    private LocalDateTime fecha_creacion;

}
