package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente,Long> {

}
