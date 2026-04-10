package com.uatf.sistema.model;

import java.time.LocalDateTime;
import java.util.List;

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
@Table(name = "unidades")
public class Unidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String sigla;
    private Integer item;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
    
    @ManyToOne
    @JoinColumn(name = "tipo_unidad_id", referencedColumnName = "id")
    private TipoUnidad tipoUnidad;

    @ManyToOne
    @JoinColumn(name = "dependiente_id", referencedColumnName = "id", nullable = true)
    private Unidad unidad;

    @OneToMany(mappedBy = "unidad")
    private List<Unidad> unidades;

    @OneToMany(mappedBy = "unidad")
    private List<Asignatura> asignaturas;
}
