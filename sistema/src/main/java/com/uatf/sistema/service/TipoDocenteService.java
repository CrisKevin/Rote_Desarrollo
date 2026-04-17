package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.TipoDocenteDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.TipoDocenteMapper;
import com.uatf.sistema.model.TipoDocente;
import com.uatf.sistema.repository.TipoDocenteRepository;

@Service
public class TipoDocenteService {

    private final TipoDocenteRepository repo;

    public TipoDocenteService(TipoDocenteRepository repo){
        this.repo = repo;
    }

    public List<TipoDocenteDTO> findAll(){
        return repo.findAll().stream().map(TipoDocenteMapper::toDTO).toList();
    }

    public List<TipoDocenteDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(TipoDocenteMapper::toDTO).toList();
    }

    public TipoDocenteDTO findOne(UUID id){
        
        TipoDocente tipoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));
        
        return TipoDocenteMapper.toDTO(tipoDocente);
    }

    public TipoDocenteDTO findOneActive(UUID id){
        
        TipoDocente tipoDocente = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));
        
        return TipoDocenteMapper.toDTO(tipoDocente);
    }

    public TipoDocenteDTO create(TipoDocenteDTO dto){

        TipoDocente tipoDocente = TipoDocenteMapper.toEntity(dto);

        return TipoDocenteMapper.toDTO(repo.save(tipoDocente));
    }

    public TipoDocenteDTO update(UUID id, TipoDocenteDTO dto){

        TipoDocente tipoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));

        tipoDocente.setTipo(dto.getTipo());
        tipoDocente.setDescripcion(dto.getDescripcion());

        return TipoDocenteMapper.toDTO(repo.save(tipoDocente));
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        TipoDocente tipoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));
        tipoDocente.setEstado(false);
        repo.save(tipoDocente);
    }
}
