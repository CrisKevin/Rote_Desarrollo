package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.DocenteDTO;
import com.uatf.sistema.model.Docente;

public class DocenteMapper {

    public static DocenteDTO toDTO(Docente entidad){
        return new DocenteDTO(
            entidad.getId(),
            entidad.getNombres(),
            entidad.getApellidos(), 
            entidad.getCi(), 
            entidad.getObservaciones(),
            entidad.getDedicacion(),
            entidad.getItem().getId(),
            entidad.getItem().getItem(),
            entidad.getCargo_tipo().getId(),
            entidad.getCargo_tipo().getTipo_docente().getTipo(),
            entidad.getCargo_tipo().getCargo_docente().getCargo(),
            entidad.getUnidad().getId(),
            entidad.getUnidad().getNombre(),
            entidad.getFecha_creacion(),
            entidad.getFecha_actualizacion()
        );
    }

    public static Docente toEntity(DocenteDTO dto){
        Docente entidad = new Docente();
        entidad.setId(dto.getId());
        entidad.setNombres(dto.getNombres());
        entidad.setApellidos(dto.getApellidos());
        entidad.setCi(dto.getCi());
        entidad.setObservaciones(dto.getObservaciones());
        return entidad;
    }
}
