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

import com.uatf.sistema.dto.TipoPeriodoDTO;
import com.uatf.sistema.service.TipoPeriodoService;

@RestController
@RequestMapping("/api/tipo_periodo")
public class TipoPeriodoController {

    private final TipoPeriodoService service;

    public TipoPeriodoController(TipoPeriodoService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TipoPeriodoDTO>> controller_get_all(){
        return ResponseEntity.ok(service.service_get_all());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoPeriodoDTO> controller_find_by_id(@PathVariable UUID id){
        return ResponseEntity.ok(service.service_find_by_UUID(id));
    }

    @PostMapping
    public ResponseEntity<TipoPeriodoDTO> controller_save(@RequestBody TipoPeriodoDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.service_save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoPeriodoDTO> controller_update(@PathVariable UUID id, @RequestBody TipoPeriodoDTO dto){
        return ResponseEntity.ok(service.service_update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> controller_delete(@PathVariable UUID id){
        service.service_delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
