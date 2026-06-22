package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.Unidad;

public interface UnidadRepository extends JpaRepository<Unidad,UUID> {
    List<Unidad> findByEstado(Boolean estado);
    Optional<Unidad> findByIdAndEstadoTrue(UUID id);
    List<Unidad> findByUnidad(Unidad unidad);
}
