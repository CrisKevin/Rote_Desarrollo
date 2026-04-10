package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.UnidadDTO;
import com.uatf.sistema.model.Unidad;

public class UnidadMapper {

    public static UnidadDTO toDTO(Unidad entidad){
        return new UnidadDTO(
            entidad.getId(),
            entidad.getNombre(),
            entidad.getSigla(),
            entidad.getItem(),
            entidad.getTipoUnidad().getId(),
            entidad.getUnidad() != null ? entidad.getUnidad().getId() : null);
    }

    public static Unidad toEntity(UnidadDTO dto){
        Unidad entidad = new Unidad();
        entidad.setId(dto.getId());
        entidad.setNombre(dto.getNombre());
        entidad.setSigla(dto.getSigla());
        entidad.setItem(dto.getItem());
        return entidad;
    }
    
}
