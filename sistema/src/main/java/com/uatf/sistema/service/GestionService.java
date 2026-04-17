package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.GestionDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.GestionMapper;
import com.uatf.sistema.model.Gestion;
import com.uatf.sistema.repository.GestionRepository;

@Service
public class GestionService {

    private final GestionRepository repo;

    public GestionService(GestionRepository repo){
        this.repo = repo;
    }

    public List<GestionDTO> findAll(){
        return repo.findAll().stream().map(GestionMapper::toDTO).toList();
    }

    public List<GestionDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(GestionMapper::toDTO).toList();
    }

    public GestionDTO findOne(UUID id){

        Gestion gestion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));

        return GestionMapper.toDTO(gestion);
    }

    public GestionDTO findOneActive(UUID id){

        Gestion gestion = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));

        return GestionMapper.toDTO(gestion);
    }

    public GestionDTO create(GestionDTO dto){

        Gestion gestion = GestionMapper.toEntity(dto);

        return GestionMapper.toDTO(repo.save(gestion));
    }

    public GestionDTO update(UUID id, GestionDTO dto){

        Gestion gestion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));

        return GestionMapper.toDTO(repo.save(gestion));
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        Gestion gestion = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));
        gestion.setEstado(false);
        repo.save(gestion);
    }

}
