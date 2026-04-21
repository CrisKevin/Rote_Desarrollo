package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AsignaturaDocenteDTO {

    private UUID id;
    private UUID grupo_id;
    private String grupo_nombre;
    private UUID docente_id;
    private String docente_nombre;
    private String docente_apellido;
    private UUID asignatura_id;
    private String asignatura_nombre;
    private UUID observacion_id;
    private String observacion_descripcion;
    private UUID periodo_id;
    private String periodo_descripcion;
    
}
