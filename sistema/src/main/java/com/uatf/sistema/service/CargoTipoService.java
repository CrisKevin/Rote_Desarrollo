package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.CargoTipoDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.CargoTipoMapper;
import com.uatf.sistema.model.CargoDocente;
import com.uatf.sistema.model.CargoTipo;
import com.uatf.sistema.model.TipoDocente;
import com.uatf.sistema.repository.CargoDocenteRepository;
import com.uatf.sistema.repository.CargoTipoRepository;
import com.uatf.sistema.repository.TipoDocenteRepository;

@Service
public class CargoTipoService {

    private final CargoTipoRepository repo;
    private final CargoDocenteRepository cargo_docente_repo;
    private final TipoDocenteRepository tipo_docente_repo;

    public CargoTipoService(CargoTipoRepository repo, CargoDocenteRepository cargo_docente_repo, TipoDocenteRepository tipo_docente_repo) {
        this.repo = repo;
        this.cargo_docente_repo = cargo_docente_repo;
        this.tipo_docente_repo = tipo_docente_repo;
    }

    public List<CargoTipoDTO> service_get_all(){
        return repo.findAll().stream().map(CargoTipoMapper::toDTO)
            .collect(Collectors.toList());
    }

    public CargoTipoDTO service_find_by_UUID(UUID id){
        CargoTipo cargoTipo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoTipo no encontrado"));

        return CargoTipoMapper.toDTO(cargoTipo);
    }

    public CargoTipoDTO service_save(CargoTipoDTO dto){
        CargoTipo cargoTipo = CargoTipoMapper.toEntity(dto);

        CargoDocente cargoDocente = cargo_docente_repo.findById(dto.getCargo_docente_id())
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));

        TipoDocente tipoDocente = tipo_docente_repo.findById(dto.getTipo_docente_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));

        cargoTipo.setCargo_docente(cargoDocente);
        cargoTipo.setTipo_docente(tipoDocente);

        return CargoTipoMapper.toDTO(repo.save(cargoTipo));
    }

    public CargoTipoDTO service_update(UUID id, CargoTipoDTO dto){
        CargoTipo cargoTipo = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("CargoTipo no encontrado"));
        
        CargoDocente cargoDocente = cargo_docente_repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));

        TipoDocente tipoDocente = tipo_docente_repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TipoDocente no encontrado"));
        
        cargoTipo.setEstado(dto.getEstado());
        cargoTipo.setCargo_docente(cargoDocente);
        cargoTipo.setTipo_docente(tipoDocente);

        return CargoTipoMapper.toDTO(repo.save(cargoTipo));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }

}
