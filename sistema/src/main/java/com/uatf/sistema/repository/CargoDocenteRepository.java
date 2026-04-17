package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.CargoDocente;

@Repository
public interface CargoDocenteRepository extends JpaRepository<CargoDocente,UUID> {
    List<CargoDocente> findByEstado(Boolean estado);
    Optional<CargoDocente> findByIdAndEstadoTrue(UUID id);
}
