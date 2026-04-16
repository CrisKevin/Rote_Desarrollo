package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.GrupoDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.GrupoMapper;
import com.uatf.sistema.model.Grupo;
import com.uatf.sistema.repository.GrupoRepository;

@Service
public class GrupoService {

    private final GrupoRepository repo;

    public GrupoService(GrupoRepository repo){
        this.repo = repo;
    }

    public List<GrupoDTO> service_get_all(){
        return repo.findAll().stream().map(GrupoMapper::toDTO)
            .collect(Collectors.toList());
    }

    public GrupoDTO service_find_by_UUID(UUID id){

        Grupo grupo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        return GrupoMapper.toDTO(grupo);
    }

    public GrupoDTO service_save(GrupoDTO dto){

        Grupo grupo = GrupoMapper.toEntity(dto);

        return GrupoMapper.toDTO(repo.save(grupo));
    }

    public GrupoDTO service_update(UUID id, GrupoDTO dto){

        Grupo grupo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        grupo.setGrupo(dto.getGrupo());
        grupo.setDescripcion(dto.getDescripcion());
        grupo.setEstado(dto.getEstado());
        return GrupoMapper.toDTO(repo.save(grupo));
    }

    public void service_delete(UUID id){
        
        repo.deleteById(id);

    }
    
}
