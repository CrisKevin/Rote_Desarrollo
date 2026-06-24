package com.uatf.sistema.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DocenteDTO {
    private UUID id;
    private String nombres;
    private String apellidos;
    private String ci;
    private String observaciones;
    private String dedicacion;
    private String item;
    private UUID cargo_tipo_id;
    private String tipo_docente_nombre;
    private String cargo_docente_nombre;
    private UUID unidad_id;
    private String unidad_nombre;
    private LocalDateTime fecha_creacion;
    private LocalDateTime fecha_actualizacion;
}
