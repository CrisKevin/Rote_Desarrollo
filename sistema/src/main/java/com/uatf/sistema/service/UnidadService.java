package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.UnidadDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.UnidadMapper;
import com.uatf.sistema.model.TipoUnidad;
import com.uatf.sistema.model.Unidad;
import com.uatf.sistema.repository.TipoUnidadRepository;
import com.uatf.sistema.repository.UnidadRepository;

@Service
public class UnidadService {

    private final UnidadRepository repo;
    private final TipoUnidadRepository tipo_unidad_repo;

    public UnidadService(UnidadRepository repo, TipoUnidadRepository tipo_unidad_repo){
        this.repo = repo;
        this.tipo_unidad_repo = tipo_unidad_repo;
    }
    
    public List<UnidadDTO> findAll(){
        return repo.findAll().stream().map(UnidadMapper::toDTO).toList();
    }

    public List<UnidadDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(UnidadMapper::toDTO).toList();
    }

    public UnidadDTO findOne(UUID id){
        Unidad unidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        return UnidadMapper.toDTO(unidad);
    }

    public UnidadDTO findOneActive(UUID id){
        Unidad unidad = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        return UnidadMapper.toDTO(unidad);
    }

    public UnidadDTO create(UnidadDTO dto){
        Unidad unidad =  UnidadMapper.toEntity(dto);
        Unidad dependiente = null;

        if(dto.getDependiente_id() != null){
            System.out.println("xaskjdasdsakjndjasndjkasndjkasndjkabdhadbjsakdbahjsdbasjkbdkajhbshdbjdbasjdbajshbdasjhdbasjkdbd");
            System.out.println(dto.getDependiente_id());
            dependiente = repo.findById(dto.getDependiente_id())
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        }

        TipoUnidad tipoUnidad = tipo_unidad_repo.findById(dto.getTipo_unidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        unidad.setUnidad(dependiente);
        unidad.setTipo_unidad(tipoUnidad);

        return UnidadMapper.toDTO(repo.save(unidad));
    }
 
    public UnidadDTO update(UUID id, UnidadDTO dto){

        Unidad unidad = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        Unidad dependiente = null;

        if(dto.getDependiente_id() != null){
            dependiente = repo.findById(dto.getDependiente_id())
                .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        }

        TipoUnidad tipoUnidad = tipo_unidad_repo.findById(dto.getTipo_unidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoUnidad no encontrado"));

        unidad.setNombre(dto.getNombre());
        unidad.setItem(dto.getItem());
        unidad.setSigla(dto.getSigla());
        unidad.setUnidad(dependiente);
        unidad.setTipo_unidad(tipoUnidad);

        return UnidadMapper.toDTO(repo.save(unidad));
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        Unidad unidad = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));
        unidad.setEstado(false);
        repo.save(unidad);
    }
}
