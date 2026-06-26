package com.uatf.sistema.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ItemDTO {

    private UUID id;
    private String dedicacion;
    private Integer item;
    private Integer horasAsignadas;
    private LocalDateTime fecha_creacion;
    private LocalDateTime fecha_actualizacion;
}
