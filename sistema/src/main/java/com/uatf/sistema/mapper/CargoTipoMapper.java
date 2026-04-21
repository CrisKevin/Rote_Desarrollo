package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.CargoTipoDTO;
import com.uatf.sistema.model.CargoTipo;

public class CargoTipoMapper {

    public static CargoTipoDTO toDTO(CargoTipo entidad){
        return new CargoTipoDTO(
            entidad.getId(), 
            entidad.getTipo_docente().getId(),
            entidad.getTipo_docente().getTipo(), 
            entidad.getCargo_docente().getId(),
            entidad.getCargo_docente().getCargo()
        );
    }

    public static CargoTipo toEntity(CargoTipoDTO dto){
        CargoTipo entidad = new CargoTipo();
        entidad.setId(dto.getId());
        return entidad;
    }
}
