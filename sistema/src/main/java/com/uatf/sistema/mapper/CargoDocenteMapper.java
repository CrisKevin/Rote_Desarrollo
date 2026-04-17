package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.CargoDocenteDTO;
import com.uatf.sistema.model.CargoDocente;

public class CargoDocenteMapper {

    public static CargoDocenteDTO toDTO(CargoDocente entidad){
        return new CargoDocenteDTO(
            entidad.getId(), 
            entidad.getCargo(),
            entidad.getDescripcion()
        );
    }

    public static CargoDocente toEntity(CargoDocenteDTO dto){
        CargoDocente entidad = new CargoDocente();
        entidad.setId(dto.getId());
        entidad.setCargo(dto.getCargo());
        entidad.setDescripcion(dto.getDescripcion());
        return entidad;
    }
}
