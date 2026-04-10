package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DocenteDTO {
    private long id;
    private String nombre;
    private String apellidos;
    private String ci;
    private String observaciones;
    private long cargoTipoId;
}
