package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.TipoDocenteDTO;
import com.uatf.sistema.model.TipoDocente;

public class TipoDocenteMapper {

    public static TipoDocenteDTO toDTO(TipoDocente entidad){
        return new TipoDocenteDTO(
            entidad.getId(), 
            entidad.getTipo(), 
            entidad.getDescripcion(),
            entidad.getEstado()
        );        
    }

    public static TipoDocente toEntity(TipoDocenteDTO dto){
        TipoDocente entidad = new TipoDocente();
        entidad.setId(dto.getId());
        entidad.setTipo(dto.getTipo());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setEstado(dto.getEstado());
        return entidad;
    }
}
