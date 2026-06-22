package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.Asignatura;

public interface AsignaturaRepository extends JpaRepository<Asignatura,UUID> {
    List<Asignatura> findByEstado(Boolean estado);
    Optional<Asignatura> findByIdAndEstadoTrue(UUID id);
}
