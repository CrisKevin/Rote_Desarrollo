package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.DocenteDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.DocenteMapper;
import com.uatf.sistema.model.CargoTipo;
import com.uatf.sistema.model.Docente;
import com.uatf.sistema.repository.CargoTipoRepository;
import com.uatf.sistema.repository.DocenteRepository;

@Service
public class DocenteService {

    private final DocenteRepository repo;
    private final CargoTipoRepository cargo_tipo_repo;

    public DocenteService(DocenteRepository repo, CargoTipoRepository cargo_tipo_repo){
        this.repo = repo;
        this.cargo_tipo_repo = cargo_tipo_repo;
    }

    public List<DocenteDTO> service_get_all(){
        return repo.findAll().stream().map(DocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public DocenteDTO service_find_by_UUID(UUID id){

        Docente docente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));
        
        return DocenteMapper.toDTO(docente);
    }

    public DocenteDTO service_save(DocenteDTO dto){
    
        Docente docente = DocenteMapper.toEntity(dto);

        CargoTipo cargo_tipo = cargo_tipo_repo.findById(dto.getCargo_tipo_id())
            .orElseThrow(() -> new ResourceNotFoundException("CargoTipo no encontrado"));

        docente.setCargo_tipo(cargo_tipo);

        return DocenteMapper.toDTO(repo.save(docente));
    }

    public DocenteDTO service_update(UUID id, DocenteDTO dto){
        
        Docente docente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));
        
        CargoTipo cargoTipo = cargo_tipo_repo.findById(dto.getCargo_tipo_id())
            .orElseThrow(() -> new ResourceNotFoundException("CargoTipo no encontrado"));
        
        docente.setNombre(dto.getNombre());
        docente.setApellidos(dto.getApellidos());
        docente.setObservaciones(dto.getObservaciones());
        docente.setCi(dto.getCi());
        docente.setEstado(dto.getEstado());
        docente.setCargo_tipo(cargoTipo);

        return DocenteMapper.toDTO(repo.save(docente));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
