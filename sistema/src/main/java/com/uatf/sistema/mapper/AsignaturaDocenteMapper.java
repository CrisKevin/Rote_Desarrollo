package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.AsignaturaDocenteDTO;
import com.uatf.sistema.model.AsignaturaDocente;

public class AsignaturaDocenteMapper {

    public static AsignaturaDocenteDTO toDTO(AsignaturaDocente entidad){
        return new AsignaturaDocenteDTO(
                entidad.getId(),
                entidad.getGrupo().getId(),
                entidad.getDocente().getId(),
                entidad.getAsignatura().getId(),
                entidad.getObservacion().getId(),
                entidad.getPeriodo().getId(),
                entidad.getEstado()
        );
    }

    public static AsignaturaDocente toEntity(AsignaturaDocenteDTO dto){
        AsignaturaDocente entidad = new AsignaturaDocente();
        entidad.setId(dto.getId());
        entidad.setEstado(dto.getEstado());
        //Esta parte estara incompleta, ya que se necesitan los servicios de cada entidad para obtener los objetos completos
        return entidad;
    }
}
