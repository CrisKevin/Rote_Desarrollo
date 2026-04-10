package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CargoDocenteDTO {

    private long id;
    private String cargo;
    private String descripcion;
}
