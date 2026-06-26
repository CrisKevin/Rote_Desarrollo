package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.ItemDTO;
import com.uatf.sistema.exceptions.DuplicateResourceException;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.ItemMapper;
import com.uatf.sistema.model.Item;
import com.uatf.sistema.repository.ItemRepository;

@Service
public class ItemService {

    private final ItemRepository repo;

    public ItemService(ItemRepository repo){
        this.repo = repo;
    }

    public List<ItemDTO> findAll(){
        return repo.findAll().stream().map(ItemMapper::toDTO).toList();
    }

    public ItemDTO findOne(UUID id){
        Item item = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        return ItemMapper.toDTO(item);
    }

    public ItemDTO crete(ItemDTO dto){

        Item item = ItemMapper.toEntity(dto);

        try{
            return ItemMapper.toDTO(repo.save(item));
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un item con este numero");
        }
    }

    public ItemDTO update(UUID id, ItemDTO dto){

        Item item = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        item.setDedicacion(dto.getDedicacion());
        item.setItem(dto.getItem());
        item.setHorasAsignadas(dto.getHorasAsignadas());

        try{
            return ItemMapper.toDTO(repo.save(item));
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un item con este numero");
        }
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }
}
