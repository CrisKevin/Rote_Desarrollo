package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.TipoUnidadDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.TipoUnidadMapper;
import com.uatf.sistema.model.TipoUnidad;
import com.uatf.sistema.repository.TipoUnidadRepository;

@Service
public class TipoUnidadService {

    private final TipoUnidadRepository repo;

    public TipoUnidadService(TipoUnidadRepository repo){
        this.repo = repo;
    }

    public List<TipoUnidadDTO> service_get_all(){
        return repo.findAll().stream().map(TipoUnidadMapper::toDTO)
            .collect(Collectors.toList());
    }

    public TipoUnidadDTO service_find_by_UUID(UUID id){

        TipoUnidad tipoUnidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        return TipoUnidadMapper.toDTO(tipoUnidad);
    }

    public TipoUnidadDTO service_save(TipoUnidadDTO dto){
        
        TipoUnidad tipoUnidad = TipoUnidadMapper.toEntity(dto);

        return TipoUnidadMapper.toDTO(repo.save(tipoUnidad));
    }

    public TipoUnidadDTO service_update(UUID id, TipoUnidadDTO dto){

        TipoUnidad tipoUnidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        tipoUnidad.setTipo(dto.getTipo());
        tipoUnidad.setDescripcion(dto.getDescripcion());
        tipoUnidad.setEstado(dto.getEstado());

        return TipoUnidadMapper.toDTO(repo.save(tipoUnidad));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
