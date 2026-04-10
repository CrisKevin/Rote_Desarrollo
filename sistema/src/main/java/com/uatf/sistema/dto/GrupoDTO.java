package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GrupoDTO {
    private long id;
    private String grupo;
    private String descripcion;
}
