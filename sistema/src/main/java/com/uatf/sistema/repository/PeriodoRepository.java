package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Periodo;

@Repository
public interface PeriodoRepository extends JpaRepository<Periodo,Long> {

}
