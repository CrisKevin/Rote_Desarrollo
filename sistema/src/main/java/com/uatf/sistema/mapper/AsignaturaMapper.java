package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.AsignaturaDTO;
import com.uatf.sistema.model.Asignatura;

public class AsignaturaMapper {

    public static AsignaturaDTO toDTO(Asignatura entidad){
        return new AsignaturaDTO(
            entidad.getId(),
            entidad.getNombre(),
            entidad.getSigla(),
            entidad.getHorasAsignadas(),
            entidad.getUnidad().getId()
        );
    }

    public static Asignatura toEntity(AsignaturaDTO dto){
        Asignatura entidad = new Asignatura();
        entidad.setId(dto.getId());
        entidad.setNombre(dto.getNombre());
        entidad.setSigla(dto.getSigla());
        entidad.setHorasAsignadas(dto.getHorasAsignadas());
        return entidad;
    }
}
