package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

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

    public List<ObservacionDTO> findAll(){
        return repo.findAll().stream().map(ObservacionMapper::toDTO).toList();
    }

    public List<ObservacionDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(ObservacionMapper::toDTO).toList();
    }

    public ObservacionDTO findOne(UUID id){
        Observacion observacion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Observación no encontrada"));

        return ObservacionMapper.toDTO(observacion);
    }

    public ObservacionDTO findOneActive(UUID id){
        Observacion observacion = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Observación no encontrada"));

        return ObservacionMapper.toDTO(observacion);
    }

    public ObservacionDTO create(ObservacionDTO dto){
        
        Observacion observacion = ObservacionMapper.toEntity(dto);

        return ObservacionMapper.toDTO(repo.save(observacion));
    }

    public ObservacionDTO update(UUID id, ObservacionDTO dto){

        Observacion observacion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Observacion no encontrada"));

        observacion.setDescripcion(dto.getDescripcion());
        observacion.setDesde(dto.getDesde());
        observacion.setHasta(dto.getHasta());

        return ObservacionMapper.toDTO(repo.save(observacion));
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        Observacion observacion = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Observacion no encontrada"));
        observacion.setEstado(false);
        repo.save(observacion);
    }
}
