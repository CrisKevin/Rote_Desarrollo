package com.uatf.sistema.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uatf.sistema.model.AsignaturaDocente;
import com.uatf.sistema.dto.ReportesDTO;

@Repository
public interface AsignaturaDocenteRepository extends JpaRepository<AsignaturaDocente, UUID> {
    List<AsignaturaDocente> findByEstado(Boolean estado);
    Optional<AsignaturaDocente> findByIdAndEstadoTrue(UUID id);
    
    @Query("SELECT new com.uatf.sistema.dto.ReportesDTO(" +
           "a.unidad.nombre, " +
           "a.grupo.grupo, " +
           "a.docente.nombres, " +
           "a.docente.apellidos, " +
           "a.docente.ci, " +
           "c.cargo, " +
           "a.docente.dedicacion, " +
           "a.asignatura.sigla, " +
           "CAST(SUBSTRING(CAST(a.asignatura.horas_asignadas AS string), 1, 2) AS integer), " +
           "a.observacion.descripcion, " +
           "a.periodo.descripcion, " +
           "a.periodo.gestion.gestion) " +
           "FROM AsignaturaDocente a " +
           "LEFT JOIN a.unidad " +
           "LEFT JOIN a.grupo " +
           "LEFT JOIN a.docente d " +
           "LEFT JOIN d.cargo_tipo ct " +
           "LEFT JOIN ct.cargo_docente c " +
           "LEFT JOIN a.asignatura " +
           "LEFT JOIN a.observacion " +
           "LEFT JOIN a.periodo " +
           "WHERE (:unidad_id IS NULL OR a.unidad.id = :unidad_id) " +
           "ORDER BY a.unidad.nombre ASC, d.apellidos ASC")
    List<ReportesDTO> obtenerAsignacionesFiltradas(@Param("unidad_id") UUID unidad_id);
}