package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.TipoPeriodoDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.TipoPeriodoMapper;
import com.uatf.sistema.model.TipoPeriodo;
import com.uatf.sistema.repository.TipoPeriodoRepository;

@Service
public class TipoPeriodoService {

    private final TipoPeriodoRepository repo;

    public TipoPeriodoService(TipoPeriodoRepository repo){
        this.repo = repo;
    }

    public List<TipoPeriodoDTO> findAll(){
        return repo.findAll().stream().map(TipoPeriodoMapper::toDTO).toList();
    }

    public List<TipoPeriodoDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(TipoPeriodoMapper::toDTO).toList();
    }

    public TipoPeriodoDTO findOne(UUID id){

        TipoPeriodo tipoPeriodo =  repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));
        
        return TipoPeriodoMapper.toDTO(tipoPeriodo);
    }


    public TipoPeriodoDTO findOneActive(UUID id){

        TipoPeriodo tipoPeriodo =  repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));
        
        return TipoPeriodoMapper.toDTO(tipoPeriodo);
    }

    public TipoPeriodoDTO create(TipoPeriodoDTO dto){

        TipoPeriodo tipoPeriodo = TipoPeriodoMapper.toEntity(dto);

        return TipoPeriodoMapper.toDTO(repo.save(tipoPeriodo));
    }

    public TipoPeriodoDTO update(UUID id, TipoPeriodoDTO dto){

        TipoPeriodo tipoPeriodo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));

        tipoPeriodo.setTipo(dto.getTipo());
        tipoPeriodo.setDescripcion(dto.getDescripcion());

        return TipoPeriodoMapper.toDTO(repo.save(tipoPeriodo));
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        TipoPeriodo tipoPeriodo = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));
        tipoPeriodo.setEstado(false);
        repo.save(tipoPeriodo);
    }
}
