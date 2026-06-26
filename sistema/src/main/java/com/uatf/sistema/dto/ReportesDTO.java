package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReportesDTO {

    private String unidadNombre;
    private String grupoNombre;
    private String docenteNombre;
    private String docenteApellido;
    private String docenteCi;
    private String cargo;
    private String dedicacion;
    private String asignaturaSigla;
    private Integer horas;
    private String observacionDescripcion;
    private String periodoDescripcion;
    private String gestion;
    private String item;
}
