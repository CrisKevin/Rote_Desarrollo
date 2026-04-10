package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.AsignaturaDocente;

@Repository
public interface AsignaturaDocenteRepository extends JpaRepository<AsignaturaDocente, Long> {
}
