package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TipoUnidadDTO {

    private long id;
    private String tipo;
    private String descripcion;
}
