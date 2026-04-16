package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<GestionDTO> service_get_all(){
        return repo.findAll().stream().map(GestionMapper::toDTO)
            .collect(Collectors.toList());
    }

    public GestionDTO service_find_by_UUID(UUID id){

        Gestion gestion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));

        return GestionMapper.toDTO(gestion);
    }

    public GestionDTO service_save(GestionDTO dto){

        Gestion gestion = GestionMapper.toEntity(dto);

        return GestionMapper.toDTO(repo.save(gestion));
    }

    public GestionDTO service_update(UUID id, GestionDTO dto){

        Gestion gestion = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));

        return GestionMapper.toDTO(repo.save(gestion));
    }

    public void service_delete(UUID id){

        repo.deleteById(id);
        
    }
}
