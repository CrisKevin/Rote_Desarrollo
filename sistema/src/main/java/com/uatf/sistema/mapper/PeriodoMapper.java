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
            entidad.getTipo_periodo().getId(),
            entidad.getEstado()
        );
    }

    public static Periodo toEntity(PeriodoDTO dto){
        Periodo entidad = new Periodo();
        entidad.setId(dto.getId());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setDesde(dto.getDesde());
        entidad.setHasta(dto.getHasta());
        entidad.setEstado(dto.getEstado());
        return entidad;
    }
    
}
