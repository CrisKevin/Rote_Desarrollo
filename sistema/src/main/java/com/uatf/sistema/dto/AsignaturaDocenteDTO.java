package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AsignaturaDocenteDTO {

    private UUID id;
    private UUID grupo_id;
    private UUID docente_id;
    private UUID asignatura_id;
    private UUID observacion_id;
    private UUID periodo_id;
    
}
