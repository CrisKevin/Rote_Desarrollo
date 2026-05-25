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
                entidad.getDocente().getNombres(),
                entidad.getDocente().getApellidos(),
                entidad.getAsignatura().getId(),
                entidad.getAsignatura().getNombre(),
                entidad.getObservacion() != null ? entidad.getObservacion().getId() : null,
                entidad.getObservacion() != null ? entidad.getObservacion().getDescripcion() : null,
                entidad.getPeriodo().getId(),
                entidad.getPeriodo().getDescripcion(),
                entidad.getUnidad().getId(),
                entidad.getUnidad().getNombre(),
                entidad.getFecha_creacion(),
                entidad.getFecha_actualizacion()

        );
    }

    public static AsignaturaDocente toEntity(AsignaturaDocenteDTO dto){
        AsignaturaDocente entidad = new AsignaturaDocente();
        entidad.setId(dto.getId());
        //Esta parte estara incompleta, ya que se necesitan los servicios de cada entidad para obtener los objetos completos
        return entidad;
    }
}
