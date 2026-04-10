package com.uatf.sistema.dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AsignaturaDTO {

    private long id;
    private String nombre;
    private String sigla;
    private LocalTime horasAsignadas;
    private long unidadId;

}
