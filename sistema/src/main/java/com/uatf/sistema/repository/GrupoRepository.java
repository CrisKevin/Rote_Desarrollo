package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.Grupo;

public interface GrupoRepository extends JpaRepository<Grupo,UUID> {
    List<Grupo> findByEstado(Boolean estado);
    Optional<Grupo> findByIdAndEstadoTrue(UUID id);
}
