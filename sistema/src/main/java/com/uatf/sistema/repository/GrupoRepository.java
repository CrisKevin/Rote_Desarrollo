package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Grupo;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo,UUID> {
    List<Grupo> findByEstado(Boolean estado);
    Optional<Grupo> findByIdAndEstadoTrue(UUID id);
}
