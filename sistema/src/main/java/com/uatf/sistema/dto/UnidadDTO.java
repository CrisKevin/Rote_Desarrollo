package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UnidadDTO {

    private long id;
    private String nombre;
    private String sigla;
    private Integer item;
    private Long tipoUnidadId;
    private Long unidadId;
}
