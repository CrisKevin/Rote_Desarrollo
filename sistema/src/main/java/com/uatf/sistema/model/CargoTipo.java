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
@Table(name = "cargo_tipos")
public class CargoTipo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
    
    @ManyToOne
    @JoinColumn(name = "tipo_id", referencedColumnName = "id")
    private TipoDocente tipoDocente;

    @ManyToOne
    @JoinColumn(name = "cargo_id", referencedColumnName = "id")
    private CargoDocente cargoDocente;

    @OneToMany(mappedBy = "cargoTipo")
    private List<CargoTipo> cargoTipos;
}
