package com.uatf.sistema.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uatf.sistema.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID>{
    Optional<Usuario> findByUsuario (String usuario);
}
