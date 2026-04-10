package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Asignatura;

@Repository
public interface AsignaturaRepository extends JpaRepository<Asignatura,Long> {

}
