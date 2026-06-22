package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.TipoUnidad;

public interface TipoUnidadRepository extends JpaRepository<TipoUnidad,UUID> {
    List<TipoUnidad> findByEstado(Boolean estado);
    Optional<TipoUnidad> findByIdAndEstadoTrue(UUID id);
}
