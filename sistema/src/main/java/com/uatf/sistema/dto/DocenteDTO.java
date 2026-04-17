package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DocenteDTO {
    private UUID id;
    private String nombre;
    private String apellidos;
    private String ci;
    private String observaciones;
    private UUID cargo_tipo_id;
    private UUID unidad_id;
}
