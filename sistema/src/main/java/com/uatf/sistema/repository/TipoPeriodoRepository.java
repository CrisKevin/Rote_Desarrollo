package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.TipoPeriodo;

@Repository
public interface TipoPeriodoRepository extends JpaRepository<TipoPeriodo,UUID> {
    List<TipoPeriodo> findByEstado(Boolean estado);
    Optional<TipoPeriodo> findByIdAndEstadoTrue(UUID id);
}
