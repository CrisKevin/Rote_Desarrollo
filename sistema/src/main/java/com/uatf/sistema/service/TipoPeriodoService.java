package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<TipoPeriodoDTO> service_get_all(){
        return repo.findAll().stream().map(TipoPeriodoMapper::toDTO)
            .collect(Collectors.toList());
    }

    public TipoPeriodoDTO service_find_by_UUID(UUID id){

        TipoPeriodo tipoPeriodo =  repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));
        
        return TipoPeriodoMapper.toDTO(tipoPeriodo);
    }

    public TipoPeriodoDTO service_save(TipoPeriodoDTO dto){

        TipoPeriodo tipoPeriodo = TipoPeriodoMapper.toEntity(dto);

        return TipoPeriodoMapper.toDTO(repo.save(tipoPeriodo));
    }

    public TipoPeriodoDTO service_update(UUID id, TipoPeriodoDTO dto){

        TipoPeriodo tipoPeriodo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));

        tipoPeriodo.setTipo(dto.getTipo());
        tipoPeriodo.setDescripcion(dto.getDescripcion());
        tipoPeriodo.setEstado(dto.getEstado());

        return TipoPeriodoMapper.toDTO(repo.save(tipoPeriodo));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
