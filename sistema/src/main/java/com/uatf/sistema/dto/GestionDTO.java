package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GestionDTO {

    private long id;
    private String gestion;
    private String descripcion;

}
