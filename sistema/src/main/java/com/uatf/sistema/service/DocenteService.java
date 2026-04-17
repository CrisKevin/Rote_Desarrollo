package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.DocenteDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.DocenteMapper;
import com.uatf.sistema.model.CargoTipo;
import com.uatf.sistema.model.Docente;
import com.uatf.sistema.model.Unidad;
import com.uatf.sistema.repository.CargoTipoRepository;
import com.uatf.sistema.repository.DocenteRepository;
import com.uatf.sistema.repository.UnidadRepository;

@Service
public class DocenteService {

    private final DocenteRepository repo;
    private final CargoTipoRepository cargo_tipo_repo;
    private final UnidadRepository unidad_repo;

    public DocenteService(DocenteRepository repo, CargoTipoRepository cargo_tipo_repo, UnidadRepository unidad_repo){
        this.repo = repo;
        this.cargo_tipo_repo = cargo_tipo_repo;
        this.unidad_repo = unidad_repo;
    }

    public List<DocenteDTO> findAll(){
        return repo.findAll().stream().map(DocenteMapper::toDTO).toList();
    }

    public List<DocenteDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(DocenteMapper::toDTO).toList();
    }

    public DocenteDTO findOne(UUID id){

        Docente docente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));
        
        return DocenteMapper.toDTO(docente);
    }

    public DocenteDTO findOneActive(UUID id){

        Docente docente = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));
        
        return DocenteMapper.toDTO(docente);
    }

    public DocenteDTO create(DocenteDTO dto){
    
        Docente docente = DocenteMapper.toEntity(dto);

        CargoTipo cargo_tipo = cargo_tipo_repo.findById(dto.getCargo_tipo_id())
            .orElseThrow(() -> new ResourceNotFoundException("CargoTipo no encontrado"));

        Unidad unidad = unidad_repo.findById(dto.getUnidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        docente.setCargo_tipo(cargo_tipo);
        docente.setUnidad(unidad);

        return DocenteMapper.toDTO(repo.save(docente));
    }

    public DocenteDTO update(UUID id, DocenteDTO dto){
        
        Docente docente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));
        
        CargoTipo cargoTipo = cargo_tipo_repo.findById(dto.getCargo_tipo_id())
            .orElseThrow(() -> new ResourceNotFoundException("CargoTipo no encontrado"));
        
        Unidad unidad = unidad_repo.findById(dto.getUnidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        docente.setNombre(dto.getNombre());
        docente.setApellidos(dto.getApellidos());
        docente.setObservaciones(dto.getObservaciones());
        docente.setCi(dto.getCi());
        docente.setCargo_tipo(cargoTipo);
        docente.setUnidad(unidad);

        return DocenteMapper.toDTO(repo.save(docente));
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        Docente docente =  repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));
        docente.setEstado(false);
        repo.save(docente);
    }

}
