package com.uatf.sistema.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name = "docentes")
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nombre;

    private String apellidos;

    private String ci;

    private String observaciones;

    @CreationTimestamp
    private LocalDateTime fecha_creacion;

    @UpdateTimestamp
    private LocalDateTime fecha_actualizacion;

    private Boolean estado = true;

    @ManyToOne 
    @JoinColumn(name = "cargo_tipo_id", referencedColumnName = "id")
    private CargoTipo cargo_tipo;

    @ManyToOne
    @JoinColumn(name = "unidad_id", referencedColumnName = "id")
    private Unidad unidad;

    @OneToMany(mappedBy = "docente")
    private List<AsignaturaDocente> asignatura_docentes;
}
