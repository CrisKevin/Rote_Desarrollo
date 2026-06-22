package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.GrupoDTO;
import com.uatf.sistema.exceptions.DuplicateResourceException;
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

    public List<GrupoDTO> findAll(){
        return repo.findAll().stream().map(GrupoMapper::toDTO).toList();
    }

    public List<GrupoDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(GrupoMapper::toDTO).toList();
    }

    public GrupoDTO findOne(UUID id){

        Grupo grupo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        return GrupoMapper.toDTO(grupo);
    }

    public GrupoDTO findOneActive(UUID id){

        Grupo grupo = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        return GrupoMapper.toDTO(grupo);
    }

    public GrupoDTO create(GrupoDTO dto){

        Grupo grupo = GrupoMapper.toEntity(dto);

        try{
            return GrupoMapper.toDTO(repo.save(grupo));
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un grupo con ese nombre");
        }
    }

    public GrupoDTO update(UUID id, GrupoDTO dto){

        Grupo grupo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        grupo.setGrupo(dto.getGrupo());
        grupo.setDescripcion(dto.getDescripcion());
        
        try{
            return GrupoMapper.toDTO(repo.save(grupo));
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un grupo con ese nombre");
        }
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        Grupo grupo = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));
        grupo.setEstado(false);
        repo.save(grupo);
    }
    
}
