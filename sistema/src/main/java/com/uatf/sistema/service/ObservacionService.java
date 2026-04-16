package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.ObservacionDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.ObservacionMapper;
import com.uatf.sistema.model.Observacion;
import com.uatf.sistema.repository.ObservacionRepository;

@Service
public class ObservacionService {

    private final ObservacionRepository repo;

    public ObservacionService(ObservacionRepository repo){
        this.repo = repo;
    }

    public List<ObservacionDTO> service_get_all(){
        return repo.findAll().stream().map(ObservacionMapper::toDTO)
            .collect(Collectors.toList());
    }

    public ObservacionDTO service_find_by_UUID(UUID id){
        Observacion observacion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Observación no encontrada"));

        return ObservacionMapper.toDTO(observacion);
    }

    public ObservacionDTO service_save(ObservacionDTO dto){
        
        Observacion observacion = ObservacionMapper.toEntity(dto);

        return ObservacionMapper.toDTO(repo.save(observacion));
    }

    public ObservacionDTO service_update(UUID id, ObservacionDTO dto){

        Observacion observacion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Observacion no encontrada"));

        observacion.setDescripcion(dto.getDescripcion());
        observacion.setDesde(dto.getDesde());
        observacion.setHasta(dto.getHasta());
        observacion.setEstado(dto.getEstado());

        return ObservacionMapper.toDTO(repo.save(observacion));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
