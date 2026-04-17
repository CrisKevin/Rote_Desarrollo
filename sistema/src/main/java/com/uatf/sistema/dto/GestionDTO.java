package com.uatf.sistema.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GestionDTO {

    private UUID id;
    private String gestion;
    private String descripcion;

}
