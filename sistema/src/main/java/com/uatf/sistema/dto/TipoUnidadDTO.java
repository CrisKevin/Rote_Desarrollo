package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TipoUnidadDTO {

    private UUID id;
    private String tipo;
    private String descripcion;
    private Boolean estado;
}
