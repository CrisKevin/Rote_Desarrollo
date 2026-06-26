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

import com.uatf.sistema.dto.ItemDTO;
import com.uatf.sistema.service.ItemService;

@RestController
@RequestMapping("/api/item")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service){
        this.service = service;
    }

    @GetMapping()
    public ResponseEntity<List<ItemDTO>> findAll(){
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> findOne(@PathVariable UUID id){
        return ResponseEntity.ok(service.findOne(id));
    }

    @PostMapping
    public ResponseEntity<ItemDTO> create(@RequestBody ItemDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crete(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> update(@PathVariable UUID id, @RequestBody ItemDTO dto){
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
