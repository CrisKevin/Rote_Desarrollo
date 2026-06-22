package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.CargoDocente;

public interface CargoDocenteRepository extends JpaRepository<CargoDocente,UUID> {
    List<CargoDocente> findByEstado(Boolean estado);
    Optional<CargoDocente> findByIdAndEstadoTrue(UUID id);
}
