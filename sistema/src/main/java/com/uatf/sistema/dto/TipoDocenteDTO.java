package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TipoDocenteDTO {
    private UUID id;
    private String tipo;
    private String descripcion;
}
