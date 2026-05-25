package com.uatf.sistema.dto;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReporteUnidadDTO {
    private String unidad;
    private String gestion;
    private String periodo;
    private String reparticion;
    private String items;
    private Map<String, List<ReportesDTO>> reportesPorDocente;
    private Map<String, Integer> totalHorasPorDocente;
}
