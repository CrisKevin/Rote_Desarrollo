package com.uatf.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.Gestion;

@Repository
public interface GestionRepository extends JpaRepository<Gestion,Long> {

}
