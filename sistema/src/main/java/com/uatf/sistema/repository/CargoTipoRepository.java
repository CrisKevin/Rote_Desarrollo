package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.CargoTipo;

@Repository
public interface CargoTipoRepository extends JpaRepository<CargoTipo,UUID> {
    List<CargoTipo> findByEstado(Boolean estado);
    Optional<CargoTipo> findByIdAndEstadoTrue(UUID id);
}
