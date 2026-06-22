package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.CargoTipo;

public interface CargoTipoRepository extends JpaRepository<CargoTipo,UUID> {
    List<CargoTipo> findByEstado(Boolean estado);
    Optional<CargoTipo> findByIdAndEstadoTrue(UUID id);
}
