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

import com.uatf.sistema.dto.PeriodoDTO;
import com.uatf.sistema.service.PeriodoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/periodo")
public class PeriodoController {
    
    private final PeriodoService service;
    
    public PeriodoController(PeriodoService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PeriodoDTO>> findAll(){
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<PeriodoDTO>> findAllActive(){
        return ResponseEntity.ok(service.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeriodoDTO> findOne(@PathVariable UUID id){
        return ResponseEntity.ok(service.findOne(id));
    }

    @GetMapping("/active/{id}")
    public ResponseEntity<PeriodoDTO> findOneActive(@PathVariable UUID id){
        return ResponseEntity.ok(service.findOneActive(id));
    }

    @PostMapping
    public ResponseEntity<PeriodoDTO> create(@RequestBody PeriodoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PeriodoDTO> update(@PathVariable UUID id, @RequestBody PeriodoDTO dto){
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
