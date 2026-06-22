package com.uatf.sistema.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
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
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String usuario;
    private String rol;
    private String password;

    @ManyToOne
    @JoinColumn(name = "unidad_id", referencedColumnName = "id", nullable = false)
    private Unidad unidad;

    @ManyToOne
    @JoinColumn(name = "docente_id", referencedColumnName = "id", nullable = false)
    private Docente docente;

    @CreationTimestamp
    private LocalDateTime fecha_creacion;

    @UpdateTimestamp
    private LocalDateTime fecha_actualizacion;
}
