package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.ObservacionDTO;
import com.uatf.sistema.model.Observacion;

public class ObservacionMapper {

    public static ObservacionDTO toDTO(Observacion entidad){
        return new ObservacionDTO(
            entidad.getId(), 
            entidad.getDescripcion(), 
            entidad.getDesde(),
            entidad.getHasta(),
            entidad.getEstado()
        );
    }

    public static Observacion toEntity(ObservacionDTO dto){
        Observacion entidad = new Observacion();
        entidad.setId(dto.getId());
        entidad.setDescripcion(dto.getDescripcion());
        entidad.setDesde(dto.getDesde());
        entidad.setHasta(dto.getHasta());
        entidad.setEstado(dto.getEstado());
        return entidad;
    }
    
}
