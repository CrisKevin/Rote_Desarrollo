package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.AsignaturaDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.AsignaturaMapper;
import com.uatf.sistema.model.Asignatura;
import com.uatf.sistema.model.Unidad;
import com.uatf.sistema.repository.AsignaturaRepository;
import com.uatf.sistema.repository.UnidadRepository;
import com.uatf.sistema.security.JwtService;

@Service
public class AsignaturaService {

    private final AsignaturaRepository repo;
    private final UnidadRepository unidad_repo;
    private final JwtService jwtService;

    public AsignaturaService(AsignaturaRepository repo, UnidadRepository unidad_repo, JwtService jwtService) {
        this.repo = repo;
        this.unidad_repo = unidad_repo;
        this.jwtService = jwtService;
    }

    public List<AsignaturaDTO> findAll(String authHeader) {

        String token = authHeader.replace("Bearer", "").trim();

        UUID unidadId = jwtService.extractUnidadId(token);

        Unidad userUnidad = unidad_repo.findById(unidadId)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        List<Asignatura> asignaturas = repo.findAll();

        asignaturas.removeIf(dato ->{
            if(!(userUnidad.getId().equals(dato.getUnidad().getId()) || (dato.getUnidad().getUnidad() != null && userUnidad.getId().equals(dato.getUnidad().getUnidad().getId())))){
                return true;
            }
            return false;
        });

        return asignaturas.stream().map(AsignaturaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<AsignaturaDTO> findAllActive(String authHeader){

        String token = authHeader.replace("Bearer", "").trim();

        UUID unidadId = jwtService.extractUnidadId(token);

        Unidad userUnidad = unidad_repo.findById(unidadId)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        List<Asignatura> asignaturas = repo.findByEstado(true);

        asignaturas.removeIf(dato ->{
            if(!(userUnidad.getId().equals(dato.getUnidad().getId()) || userUnidad.getId().equals(dato.getUnidad().getUnidad().getId()))){
                return true;
            }
            return false;
        });

        return asignaturas.stream().map(AsignaturaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public AsignaturaDTO findOne(UUID id) {
        Asignatura asignatura = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));
        return AsignaturaMapper.toDTO(asignatura);

    }

    public AsignaturaDTO findOneActive(UUID id){
        Asignatura asignatura = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));
        return AsignaturaMapper.toDTO(asignatura);
    }

    public AsignaturaDTO create(AsignaturaDTO dto) {
        Asignatura asignatura = AsignaturaMapper.toEntity(dto);

        Unidad unidad = unidad_repo.findById(dto.getUnidad_id())
                .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        asignatura.setUnidad(unidad);
        
        return AsignaturaMapper.toDTO(repo.save(asignatura));
    }

    public AsignaturaDTO update(UUID id, AsignaturaDTO dto) {

        Asignatura asignatura = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));

        Unidad unidad = unidad_repo.findById(dto.getUnidad_id())
                .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        asignatura.setNombre(dto.getNombre());
        asignatura.setSigla(dto.getSigla());
        asignatura.setUnidad(unidad);
        asignatura.setHoras_asignadas(dto.getHoras_asignadas());

        Asignatura guardado = repo.save(asignatura);
        return AsignaturaMapper.toDTO(guardado);
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }

    public void softDelete(UUID id){ 
        Asignatura asignatura = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));
        asignatura.setEstado(false);
        repo.save(asignatura);
    }
}
