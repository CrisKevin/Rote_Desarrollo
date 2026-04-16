package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.TipoUnidadDTO;
import com.uatf.sistema.model.TipoUnidad;

public class TipoUnidadMapper {

    public static TipoUnidadDTO toDTO(TipoUnidad entidad){
        return new TipoUnidadDTO(
            entidad.getId(), 
            entidad.getTipo(), 
            entidad.getDescripcion(),
            entidad.getEstado()
        );
    }

    public static TipoUnidad toEntity(TipoUnidadDTO dto){
        TipoUnidad entidad = new TipoUnidad();
        entidad.setId(dto.getId());
        entidad.setTipo(dto.getTipo());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setEstado(dto.getEstado());
        return entidad;
    }
}
