package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.UnidadDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.UnidadMapper;
import com.uatf.sistema.model.TipoUnidad;
import com.uatf.sistema.model.Unidad;
import com.uatf.sistema.repository.TipoUnidadRepository;
import com.uatf.sistema.repository.UnidadRepository;

@Service
public class UnidadService {

    private final UnidadRepository repo;
    private final TipoUnidadRepository tipo_unidad_repo;

    public UnidadService(UnidadRepository repo, TipoUnidadRepository tipo_unidad_repo){
        this.repo = repo;
        this.tipo_unidad_repo = tipo_unidad_repo;
    }
    
    public List<UnidadDTO> service_get_all(){
        return repo.findAll().stream().map(UnidadMapper::toDTO)
            .collect(Collectors.toList());
    }

    public UnidadDTO service_find_by_UUID(UUID id){
        
        Unidad unidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        return UnidadMapper.toDTO(unidad);

    }

    public UnidadDTO service_save(UnidadDTO dto){

        Unidad unidad =  UnidadMapper.toEntity(dto);

        Unidad dependiente = null;

        if(dto.getUnidad_id() != null){
            dependiente = repo.findById(dto.getUnidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        }

        TipoUnidad tipoUnidad = tipo_unidad_repo.findById(dto.getTipo_unidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        unidad.setUnidad(dependiente);
        unidad.setTipoUnidad(tipoUnidad);

        return UnidadMapper.toDTO(repo.save(unidad));
    }
 
    public UnidadDTO service_update(UUID id, UnidadDTO dto){

        Unidad unidad = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        Unidad dependiente = null;

        if(dto.getUnidad_id() != null){
            dependiente = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        }

        TipoUnidad tipoUnidad = tipo_unidad_repo.findById(dto.getTipo_unidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        unidad.setNombre(dto.getNombre());
        unidad.setItem(dto.getItem());
        unidad.setSigla(dto.getSigla());
        unidad.setUnidad(dependiente);
        unidad.setTipoUnidad(tipoUnidad);
        unidad.setEstado(dto.getEstado());

        return UnidadMapper.toDTO(repo.save(unidad));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
