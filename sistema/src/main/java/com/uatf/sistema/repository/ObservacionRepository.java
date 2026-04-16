package com.uatf.sistema.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Observacion;

@Repository
public interface ObservacionRepository extends JpaRepository<Observacion,UUID> {

}
