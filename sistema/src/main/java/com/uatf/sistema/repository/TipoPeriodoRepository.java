package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.TipoPeriodo;

@Repository
public interface TipoPeriodoRepository extends JpaRepository<TipoPeriodo,Long> {

}
