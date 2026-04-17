package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Gestion;

@Repository
public interface GestionRepository extends JpaRepository<Gestion,UUID> {
    List<Gestion> findByEstado(Boolean estado);
    Optional<Gestion> findByIdAndEstadoTrue(UUID id);
}
