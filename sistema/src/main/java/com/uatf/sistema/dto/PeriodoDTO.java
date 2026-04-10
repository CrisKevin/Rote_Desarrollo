package com.uatf.sistema.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PeriodoDTO {

    private long id;
    private String descripcion;
    private LocalDateTime desde;
    private LocalDateTime hasta;
    private Long gestionId;
    private Long tipoPeriodoId;
    
}
