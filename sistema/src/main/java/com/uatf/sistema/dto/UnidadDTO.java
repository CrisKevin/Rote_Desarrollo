package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UnidadDTO {

    private UUID id;
    private String nombre;
    private String sigla;
    private Integer item;
    private UUID tipo_unidad_id;
    private UUID dependiente_id;
    
}
