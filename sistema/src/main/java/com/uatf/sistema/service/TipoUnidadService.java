package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.TipoUnidadDTO;
import com.uatf.sistema.exceptions.DuplicateResourceException;
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

    public List<TipoUnidadDTO> findAll(){
        return repo.findAll().stream().map(TipoUnidadMapper::toDTO).toList();
    }

    public List<TipoUnidadDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(TipoUnidadMapper::toDTO).toList();
    }

    public TipoUnidadDTO findOne(UUID id){

        TipoUnidad tipoUnidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        return TipoUnidadMapper.toDTO(tipoUnidad);
    }

    public TipoUnidadDTO findOneActive(UUID id){

        TipoUnidad tipoUnidad = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        return TipoUnidadMapper.toDTO(tipoUnidad);
    }

    public TipoUnidadDTO create(TipoUnidadDTO dto){
        
        TipoUnidad tipoUnidad = TipoUnidadMapper.toEntity(dto);

        try{
            return TipoUnidadMapper.toDTO(repo.save(tipoUnidad));
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un tipo de unidad con este nombre");
        }
    }

    public TipoUnidadDTO update(UUID id, TipoUnidadDTO dto){

        TipoUnidad tipoUnidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        tipoUnidad.setTipo(dto.getTipo());
        tipoUnidad.setDescripcion(dto.getDescripcion());

        try{
            return TipoUnidadMapper.toDTO(repo.save(tipoUnidad));
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un tipo de unidad con este nombre");
        }
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        TipoUnidad tipoUnidad = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));
        tipoUnidad.setEstado(false);
        repo.save(tipoUnidad);
    }
}
