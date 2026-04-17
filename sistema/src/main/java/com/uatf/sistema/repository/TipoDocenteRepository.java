package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.TipoDocente;

@Repository
public interface TipoDocenteRepository extends JpaRepository<TipoDocente,UUID> {
    List<TipoDocente> findByEstado(Boolean estado);
    Optional<TipoDocente> findByIdAndEstadoTrue(UUID id);
}
