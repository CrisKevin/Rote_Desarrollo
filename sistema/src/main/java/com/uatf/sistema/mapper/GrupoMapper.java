package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.GrupoDTO;
import com.uatf.sistema.model.Grupo;

public class GrupoMapper {

    public static GrupoDTO toDTO(Grupo entidad){
        return new GrupoDTO(
            entidad.getId(),
            entidad.getGrupo(),
            entidad.getDescripcion(),
            entidad.getFecha_creacion()
        );
    }
    
    public static Grupo toEntity(GrupoDTO dto){
        Grupo entidad = new Grupo();
        entidad.setId(dto.getId());
        entidad.setGrupo(dto.getGrupo());
        entidad.setDescripcion(dto.getDescripcion());
        return entidad;
    }
}
