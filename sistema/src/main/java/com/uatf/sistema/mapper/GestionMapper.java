package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.GestionDTO;
import com.uatf.sistema.model.Gestion;

public class GestionMapper {

    public static GestionDTO toDTO(Gestion entidad){
        return new GestionDTO(
            entidad.getId(), 
            entidad.getGestion(), 
            entidad.getDescripcion(),
            entidad.getEstado()
        );
    }

    public static Gestion toEntity(GestionDTO dto){
        Gestion entidad = new Gestion();
        entidad.setId(dto.getId());
        entidad.setGestion(dto.getGestion());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setEstado(dto.getEstado());
        return entidad;
    }
}
