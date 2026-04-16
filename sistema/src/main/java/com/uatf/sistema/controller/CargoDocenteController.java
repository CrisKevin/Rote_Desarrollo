package com.uatf.sistema.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uatf.sistema.dto.CargoDocenteDTO;
import com.uatf.sistema.service.CargoDocenteService;

@RestController
@RequestMapping("/api/cargo_docente")
public class CargoDocenteController {

    private final CargoDocenteService service;

    public CargoDocenteController(CargoDocenteService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CargoDocenteDTO>> controller_get_all(){
        return ResponseEntity.ok(service.service_get_all());       
    }

    @GetMapping("/{id}")
    public ResponseEntity<CargoDocenteDTO> controller_find_by_id(@PathVariable UUID id){
        return ResponseEntity.ok(service.service_get_by_UUID(id));
    }

    @PostMapping
    public ResponseEntity<CargoDocenteDTO> controller_save(@RequestBody CargoDocenteDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.service_save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CargoDocenteDTO> controller_update(@PathVariable UUID id, @RequestBody CargoDocenteDTO dto){
        return ResponseEntity.ok(service.service_update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> controller_delete(@PathVariable UUID id){
        service.service_delete(id);
        return ResponseEntity.noContent().build();
    }
}
