package com.uatf.sistema.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GetUsuarioDTO {

    private UUID id;
    private String usuario;
    private String rol;
    private UUID unidad_id;
    private String unidad_nombre;
    private UUID docente_id;
    private String docente_nombre;
    private LocalDateTime fecha_actualizacion;
    private LocalDateTime fecha_creacion;
    
}
