package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.PeriodoDTO;
import com.uatf.sistema.model.Periodo;

public class PeriodoMapper {

    public static PeriodoDTO toDTO(Periodo entidad){
        return new PeriodoDTO(
            entidad.getId(),
            entidad.getDescripcion(),
            entidad.getDesde(), 
            entidad.getHasta(), 
            entidad.getGestion().getId(),
            entidad.getGestion().getDescripcion(),
            entidad.getTipo_periodo().getId(),
            entidad.getTipo_periodo().getTipo(),
            entidad.getFecha_creacion()
        );
    }

    public static Periodo toEntity(PeriodoDTO dto){
        Periodo entidad = new Periodo();
        entidad.setId(dto.getId());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setDesde(dto.getDesde());
        entidad.setHasta(dto.getHasta());
        return entidad;
    }
    
}
