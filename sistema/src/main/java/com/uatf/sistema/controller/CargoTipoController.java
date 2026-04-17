package com.uatf.sistema.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uatf.sistema.dto.CargoTipoDTO;
import com.uatf.sistema.service.CargoTipoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/cargo_tipo")
public class CargoTipoController {

    private final CargoTipoService service;

    public CargoTipoController(CargoTipoService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CargoTipoDTO>> findAll(){
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<CargoTipoDTO>> findAllActive(){
        return ResponseEntity.ok(service.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CargoTipoDTO> findOne(@PathVariable UUID id){
        return ResponseEntity.ok(service.findOne(id));
    }

    @GetMapping("/active/{id}")
    public ResponseEntity<CargoTipoDTO> findOneActive(@PathVariable UUID id){
        return ResponseEntity.ok(service.findOneActive(id));
    }

    @PostMapping
    public ResponseEntity<CargoTipoDTO> create(@RequestBody CargoTipoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CargoTipoDTO> update(@PathVariable UUID id, @RequestBody CargoTipoDTO dto){
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/soft/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable UUID id){
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
