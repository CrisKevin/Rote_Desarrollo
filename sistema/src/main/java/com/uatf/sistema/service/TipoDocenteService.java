package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<TipoDocenteDTO> service_get_all(){
        return repo.findAll().stream().map(TipoDocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public TipoDocenteDTO service_find_by_UUID(UUID id){
        
        TipoDocente tipoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));
        
        return TipoDocenteMapper.toDTO(tipoDocente);
    }

    public TipoDocenteDTO service_save(TipoDocenteDTO dto){

        TipoDocente tipoDocente = TipoDocenteMapper.toEntity(dto);

        return TipoDocenteMapper.toDTO(repo.save(tipoDocente));
    }

    public TipoDocenteDTO service_update(UUID id, TipoDocenteDTO dto){

        TipoDocente tipoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));

        tipoDocente.setTipo(dto.getTipo());
        tipoDocente.setDescripcion(dto.getDescripcion());
        tipoDocente.setEstado(dto.getEstado());

        return TipoDocenteMapper.toDTO(repo.save(tipoDocente));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
