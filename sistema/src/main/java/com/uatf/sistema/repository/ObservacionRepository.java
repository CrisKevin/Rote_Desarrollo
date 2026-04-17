package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Observacion;

@Repository
public interface ObservacionRepository extends JpaRepository<Observacion,UUID> {
    List<Observacion> findByEstado(Boolean estado);
    Optional<Observacion> findByIdAndEstadoTrue(UUID id);
}
