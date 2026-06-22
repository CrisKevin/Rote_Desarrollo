package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.TipoPeriodo;

public interface TipoPeriodoRepository extends JpaRepository<TipoPeriodo,UUID> {
    List<TipoPeriodo> findByEstado(Boolean estado);
    Optional<TipoPeriodo> findByIdAndEstadoTrue(UUID id);
}
