package com.uatf.sistema.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.UsuarioDTO;
import com.uatf.sistema.model.Usuario;
import com.uatf.sistema.repository.UsuarioRepository;


@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder encoder){
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = repo.findByUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario " + username + " no encontrado"));
   
        return new User(usuario.getUsuario(), usuario.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol())));
          
    }

    public void createUser(UsuarioDTO dto){
        
        if(dto.getPassword().isEmpty() || dto.getPassword().length() < 8)
            throw new IllegalArgumentException("Ingrese una contraseña mas segura");

        String passwordEncrypted = encoder.encode(dto.getPassword());

        Usuario usuario = new Usuario();

        usuario.setUsuario(dto.getUsuario());
        usuario.setPassword(passwordEncrypted);
        usuario.setRol(dto.getRol());

        repo.save(usuario);

    }

}
