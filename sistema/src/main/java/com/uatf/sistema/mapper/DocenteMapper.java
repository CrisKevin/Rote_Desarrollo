package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.DocenteDTO;
import com.uatf.sistema.model.Docente;

public class DocenteMapper {

    public static DocenteDTO toDTO(Docente entidad){
        return new DocenteDTO(
            entidad.getId(),
            entidad.getNombre(),
            entidad.getApellidos(), 
            entidad.getCi(), 
            entidad.getObservaciones(),
            entidad.getCargoTipo().getId());
    }

    public static Docente toEntity(DocenteDTO dto){
        Docente entidad = new Docente();
        entidad.setId(dto.getId());
        entidad.setNombre(dto.getNombre());
        entidad.setApellidos(dto.getApellidos());
        entidad.setCi(dto.getCi());
        entidad.setObservaciones(dto.getObservaciones());
        return entidad;
    }
}
