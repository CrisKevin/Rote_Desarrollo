package com.uatf.sistema.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name = "asignatura_docentes")
public class AsignaturaDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    private LocalDateTime fecha_creacion;

    @UpdateTimestamp
    private LocalDateTime fecha_actualizacion;

    private Boolean estado = true;

    @ManyToOne
    @JoinColumn(name = "grupo_id",referencedColumnName = "id")
    private Grupo grupo;

    @ManyToOne
    @JoinColumn(name = "docente_id",referencedColumnName = "id")
    private Docente docente;

    @ManyToOne
    @JoinColumn(name = "asignatura_id",referencedColumnName = "id")
    private Asignatura asignatura;

    @ManyToOne
    @JoinColumn(name = "observacion_id", referencedColumnName = "id")
    private Observacion observacion;

    @ManyToOne
    @JoinColumn(name = "periodo_id", referencedColumnName = "id")
    private Periodo periodo;
}
