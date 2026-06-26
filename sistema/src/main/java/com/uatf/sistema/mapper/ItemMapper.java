package com.uatf.sistema.mapper;

import com.uatf.sistema.dto.ItemDTO;
import com.uatf.sistema.model.Item;

public class ItemMapper {

    public static ItemDTO toDTO(Item entidad){
        return new ItemDTO(
            entidad.getId(),
            entidad.getDedicacion(),
            entidad.getItem(),
            entidad.getHorasAsignadas(),
            entidad.getFecha_creacion(),
            entidad.getFecha_actualizacion()
        );
    }

    public static Item toEntity(ItemDTO dto){
        Item entidad = new Item();
        entidad.setId(dto.getId());
        entidad.setDedicacion(dto.getDedicacion());
        entidad.setItem(dto.getItem());
        entidad.setHorasAsignadas(dto.getHorasAsignadas());
        return entidad;
    }
}
