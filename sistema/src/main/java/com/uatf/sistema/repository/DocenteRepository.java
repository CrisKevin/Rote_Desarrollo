package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente,UUID> {
    List<Docente> findByEstado(Boolean estado);
    Optional<Docente> findByIdAndEstadoTrue(UUID id);
}
