package com.uatf.sistema.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CargoTipoDTO {

    private UUID id;
    private UUID tipo_docente_id;
    private String tipo_docente_nombre;
    private UUID cargo_docente_id;
    private String cargo_docente_nombre;
    private LocalDateTime fecha_creacion;
    
}
