package com.uatf.sistema.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Unidad;

@Repository
public interface UnidadRepository extends JpaRepository<Unidad,UUID> {

}
