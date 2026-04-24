package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.AsignaturaDocenteDTO;
import com.uatf.sistema.model.AsignaturaDocente;

public class AsignaturaDocenteMapper {

    public static AsignaturaDocenteDTO toDTO(AsignaturaDocente entidad){
        return new AsignaturaDocenteDTO(
                entidad.getId(),
                entidad.getGrupo().getId(),
                entidad.getGrupo().getGrupo(),
                entidad.getDocente().getId(),
                entidad.getDocente().getNombre(),
                entidad.getDocente().getApellidos(),
                entidad.getAsignatura().getId(),
                entidad.getAsignatura().getNombre(),
                entidad.getObservacion().getId(),
                entidad.getObservacion().getDescripcion(),
                entidad.getPeriodo().getId(),
                entidad.getPeriodo().getDescripcion(),
                entidad.getFecha_creacion()
                
        );
    }

    public static AsignaturaDocente toEntity(AsignaturaDocenteDTO dto){
        AsignaturaDocente entidad = new AsignaturaDocente();
        entidad.setId(dto.getId());
        //Esta parte estara incompleta, ya que se necesitan los servicios de cada entidad para obtener los objetos completos
        return entidad;
    }
}
