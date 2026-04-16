package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.CargoDocenteDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.CargoDocenteMapper;
import com.uatf.sistema.model.CargoDocente;
import com.uatf.sistema.repository.CargoDocenteRepository;

@Service
public class CargoDocenteService {

    private final CargoDocenteRepository repo;

    public CargoDocenteService(CargoDocenteRepository repo) {
        this.repo = repo;
    }

    public List<CargoDocenteDTO> service_get_all(){
        return repo.findAll().stream().map(CargoDocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public CargoDocenteDTO service_get_by_UUID(UUID id){
        CargoDocente cargoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));
        return CargoDocenteMapper.toDTO(cargoDocente);
    }

    public CargoDocenteDTO service_save(CargoDocenteDTO dto){
        CargoDocente cargoDocente = CargoDocenteMapper.toEntity(dto);
        return CargoDocenteMapper.toDTO(repo.save(cargoDocente));
    }

    public CargoDocenteDTO service_update(UUID id, CargoDocenteDTO dto){
        CargoDocente cargoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));

        cargoDocente.setCargo(dto.getCargo());
        cargoDocente.setDescripcion(dto.getDescripcion());
        cargoDocente.setEstado(dto.getEstado());

        return CargoDocenteMapper.toDTO(cargoDocente);
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
}
