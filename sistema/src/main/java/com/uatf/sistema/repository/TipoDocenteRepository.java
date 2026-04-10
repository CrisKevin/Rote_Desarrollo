package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.TipoDocente;

@Repository
public interface TipoDocenteRepository extends JpaRepository<TipoDocente,Long> {

}
