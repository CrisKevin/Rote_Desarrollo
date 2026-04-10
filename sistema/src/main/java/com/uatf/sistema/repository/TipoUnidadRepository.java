package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.TipoUnidad;

@Repository
public interface TipoUnidadRepository extends JpaRepository<TipoUnidad,Long> {

}
