package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CargoTipoDTO {

    private long id;
    private long tipoDocenteId;
    private long cargoDocenteId;
    
}
