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

    public List<CargoDocenteDTO> findAll(){
        return repo.findAll().stream().map(CargoDocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public List<CargoDocenteDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(CargoDocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public CargoDocenteDTO findOne(UUID id){
        CargoDocente cargoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));
        return CargoDocenteMapper.toDTO(cargoDocente);
    }

    public CargoDocenteDTO findOneActive(UUID id){
        CargoDocente cargoDocente = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));
        return CargoDocenteMapper.toDTO(cargoDocente);
    }

    public CargoDocenteDTO create(CargoDocenteDTO dto){
        CargoDocente cargoDocente = CargoDocenteMapper.toEntity(dto);
        return CargoDocenteMapper.toDTO(repo.save(cargoDocente));
    }

    public CargoDocenteDTO update(UUID id, CargoDocenteDTO dto){
        CargoDocente cargoDocente = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CargoDocente no encontrado"));

        cargoDocente.setCargo(dto.getCargo());
        cargoDocente.setDescripcion(dto.getDescripcion());

        return CargoDocenteMapper.toDTO(cargoDocente);
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        CargoDocente cargoDocente = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException(null));
        cargoDocente.setEstado(false);
        repo.save(cargoDocente);
    }
}
