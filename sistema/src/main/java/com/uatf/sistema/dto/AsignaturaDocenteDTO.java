package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AsignaturaDocenteDTO {

    private long id;
    private long grupoId;
    private long docenteId;
    private long asignaturaId;
    private long observacionId;
    private long periodoId;
    
}
