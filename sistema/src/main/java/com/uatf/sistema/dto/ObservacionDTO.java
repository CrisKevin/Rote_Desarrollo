package com.uatf.sistema.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ObservacionDTO {
    private long id;
    private String descripcion;
    private LocalDateTime desde;
    private LocalDateTime hasta;

}
