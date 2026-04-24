package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.TipoPeriodoDTO;
import com.uatf.sistema.model.TipoPeriodo;

public class TipoPeriodoMapper {

    public static TipoPeriodoDTO toDTO(TipoPeriodo entidad){
        return new TipoPeriodoDTO(
            entidad.getId(), 
            entidad.getTipo(), 
            entidad.getDescripcion(),
            entidad.getFecha_creacion()
        );
    }

    public static TipoPeriodo toEntity(TipoPeriodoDTO dto){
        TipoPeriodo tipoPeriodo = new TipoPeriodo();
        tipoPeriodo.setId(dto.getId());
        tipoPeriodo.setTipo(dto.getTipo());
        tipoPeriodo.setDescripcion(dto.getDescripcion());
        return tipoPeriodo;
    }
}
