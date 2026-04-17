package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.AsignaturaDocenteDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.AsignaturaDocenteMapper;
import com.uatf.sistema.model.Asignatura;
import com.uatf.sistema.model.AsignaturaDocente;
import com.uatf.sistema.model.Docente;
import com.uatf.sistema.model.Grupo;
import com.uatf.sistema.model.Observacion;
import com.uatf.sistema.model.Periodo;
import com.uatf.sistema.repository.AsignaturaDocenteRepository;
import com.uatf.sistema.repository.AsignaturaRepository;
import com.uatf.sistema.repository.DocenteRepository;
import com.uatf.sistema.repository.GrupoRepository;
import com.uatf.sistema.repository.ObservacionRepository;
import com.uatf.sistema.repository.PeriodoRepository;

@Service
public class AsignaturaDocenteService {

    private final AsignaturaDocenteRepository repo;
    private final GrupoRepository grupo_repo;
    private final DocenteRepository docente_repo;
    private final AsignaturaRepository asignatura_repo;
    private final ObservacionRepository observacion_repo;
    private final PeriodoRepository periodo_repo;

    public AsignaturaDocenteService(AsignaturaDocenteRepository repo, GrupoRepository grupo_repo,
            DocenteRepository docente_repo, AsignaturaRepository asignatura_repo,
            ObservacionRepository observacion_repo, PeriodoRepository periodo_repo) {
        this.repo = repo;
        this.grupo_repo = grupo_repo;
        this.docente_repo = docente_repo;
        this.asignatura_repo = asignatura_repo;
        this.observacion_repo = observacion_repo;
        this.periodo_repo = periodo_repo;
    }

    public List<AsignaturaDocenteDTO> findAll(){
        return repo.findAll().stream().map(AsignaturaDocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public List<AsignaturaDocenteDTO> findAllActive(){
        return repo.findByEstado(true).stream().map(AsignaturaDocenteMapper::toDTO)
            .collect(Collectors.toList());
    }

    public AsignaturaDocenteDTO findOne(UUID id){
        AsignaturaDocente asignatura = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("AsignaturaDocente no encontrado"));
        return AsignaturaDocenteMapper.toDTO(asignatura);
    }

    public AsignaturaDocenteDTO findOneActive(UUID id){
        AsignaturaDocente asignatura = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("AsignaturaDocente no encontrado"));
        return AsignaturaDocenteMapper.toDTO(asignatura);
    }

    public AsignaturaDocenteDTO create(AsignaturaDocenteDTO dto){

        AsignaturaDocente asignatura = AsignaturaDocenteMapper.toEntity(dto);

        Grupo grupo = grupo_repo.findById(dto.getGrupo_id())
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        Docente docente = docente_repo.findById(dto.getDocente_id())
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));

        Asignatura asig = asignatura_repo.findById(dto.getAsignatura_id())
            .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));

        Periodo periodo = periodo_repo.findById(dto.getPeriodo_id())
            .orElseThrow(() -> new ResourceNotFoundException("Periodo no encontrado"));

        Observacion observacion = observacion_repo.findById(dto.getObservacion_id())
            .orElseThrow(() -> new ResourceNotFoundException("Observacion no encontrada"));

        asignatura.setGrupo(grupo);
        asignatura.setDocente(docente);
        asignatura.setAsignatura(asig);
        asignatura.setPeriodo(periodo);
        asignatura.setObservacion(observacion);

        return AsignaturaDocenteMapper.toDTO(repo.save(asignatura));

    }

    public AsignaturaDocenteDTO update(UUID id, AsignaturaDocenteDTO dto){

        AsignaturaDocente asignatura = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("AsignaturDocente no encontrado"));

        Grupo grupo = grupo_repo.findById(dto.getGrupo_id())
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        Docente docente = docente_repo.findById(dto.getDocente_id())
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));

        Asignatura asig = asignatura_repo.findById(dto.getAsignatura_id())
            .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));

        Periodo periodo = periodo_repo.findById(dto.getPeriodo_id())
            .orElseThrow(() -> new ResourceNotFoundException("Periodo no encontrado"));

        Observacion observacion = observacion_repo.findById(dto.getObservacion_id())
            .orElseThrow(() -> new ResourceNotFoundException("Observacion no encontrada"));

        asignatura.setAsignatura(asig);
        asignatura.setDocente(docente);
        asignatura.setGrupo(grupo);
        asignatura.setPeriodo(periodo);
        asignatura.setObservacion(observacion);

        AsignaturaDocente guardado = repo.save(asignatura);
        return AsignaturaDocenteMapper.toDTO(guardado);
    }

    public void delete(UUID id){
        repo.deleteById(id);
    }

    public void softDelete(UUID id){
        AsignaturaDocente asignaturaDocente = repo.findByIdAndEstadoTrue(id)
            .orElseThrow(() -> new ResourceNotFoundException("AsignaturaDocente no encontrado"));
        asignaturaDocente.setEstado(false);
        repo.save(asignaturaDocente);
    }
}
