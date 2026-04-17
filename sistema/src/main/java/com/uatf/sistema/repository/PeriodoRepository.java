package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Periodo;

@Repository
public interface PeriodoRepository extends JpaRepository<Periodo,UUID> {
    List<Periodo> findByEstado(Boolean estado);
    Optional<Periodo> findByIdAndEstadoTrue(UUID id);
}
