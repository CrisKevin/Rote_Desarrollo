package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.PeriodoDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.mapper.PeriodoMapper;
import com.uatf.sistema.model.Gestion;
import com.uatf.sistema.model.Periodo;
import com.uatf.sistema.model.TipoPeriodo;
import com.uatf.sistema.repository.GestionRepository;
import com.uatf.sistema.repository.PeriodoRepository;
import com.uatf.sistema.repository.TipoPeriodoRepository;

@Service
public class PeriodoService {

    private final PeriodoRepository repo;
    private final GestionRepository gestion_repo;
    private final TipoPeriodoRepository tipo_periodo_repo;

    public PeriodoService(PeriodoRepository repo, GestionRepository gestion_repo, TipoPeriodoRepository tipo_periodo_repo){
        this.repo = repo;
        this.gestion_repo = gestion_repo;
        this.tipo_periodo_repo = tipo_periodo_repo;
    }

    public List<PeriodoDTO> service_get_all(){
        return repo.findAll().stream().map(PeriodoMapper::toDTO)
            .collect(Collectors.toList());
    }

    public PeriodoDTO find_by_UUID(UUID id){
        
        Periodo periodo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Periodo no encontrado"));

        return PeriodoMapper.toDTO(periodo);
    }

    public PeriodoDTO service_save(PeriodoDTO dto){

        Periodo periodo = PeriodoMapper.toEntity(dto);
        Gestion gestion = gestion_repo.findById(dto.getGestion_id())
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));
        TipoPeriodo tipoPeriodo =  tipo_periodo_repo.findById(dto.getTipo_periodo_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));

        periodo.setGestion(gestion);
        periodo.setTipo_periodo(tipoPeriodo);

        return PeriodoMapper.toDTO(repo.save(periodo));
    }

    public PeriodoDTO service_update(UUID id, PeriodoDTO dto){

        Periodo periodo = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Periodo no encontrado"));
        Gestion gestion = gestion_repo.findById(dto.getGestion_id())
            .orElseThrow(() -> new ResourceNotFoundException("Gestion no encontrada"));
        TipoPeriodo tipoPeriodo =  tipo_periodo_repo.findById(dto.getTipo_periodo_id())
            .orElseThrow(() -> new ResourceNotFoundException("TipoPeriodo no encontrado"));

        periodo.setDescripcion(dto.getDescripcion());
        periodo.setDesde(dto.getDesde());
        periodo.setHasta(dto.getHasta());
        periodo.setEstado(dto.getEstado());
        periodo.setGestion(gestion);
        periodo.setTipo_periodo(tipoPeriodo);

        return PeriodoMapper.toDTO(repo.save(periodo));
    }

    public void service_delete(UUID id){
        repo.deleteById(id);
    }
    
}
