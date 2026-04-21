package com.uatf.sistema.dto;

import java.time.LocalTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AsignaturaDTO {

    private UUID id;
    private String nombre;
    private String sigla;
    private LocalTime horas_asignadas;
    private UUID unidad_id;
    private String unidad_nombre;
}
