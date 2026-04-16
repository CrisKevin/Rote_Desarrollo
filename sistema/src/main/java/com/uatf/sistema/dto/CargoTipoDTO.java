package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CargoTipoDTO {

    private UUID id;
    private UUID tipo_docente_id;
    private UUID cargo_docente_id;
    private Boolean estado;
    
}
