package com.uatf.sistema.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name="items")
public class Item {

    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    private String dedicacion;

    @Column(unique = true)
    private Integer item;

    private Integer horasAsignadas;

    @CreationTimestamp
    private LocalDateTime fecha_creacion;

    @UpdateTimestamp
    private LocalDateTime fecha_actualizacion;

    @OneToMany(mappedBy="item")
    private List<Docente> docentes;
}
