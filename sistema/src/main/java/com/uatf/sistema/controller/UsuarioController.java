package com.uatf.sistema.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uatf.sistema.dto.AuthResponse;
import com.uatf.sistema.dto.GetUsuarioDTO;
import com.uatf.sistema.dto.UsuarioDTO;
import com.uatf.sistema.security.JwtService;
import com.uatf.sistema.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class UsuarioController {

    private final AuthenticationManager authManager;
    private final UsuarioService service;
    private final JwtService jwt;

    public UsuarioController(UsuarioService service, JwtService jwt, AuthenticationManager authManager){
        this.service = service;
        this.jwt = jwt;
        this.authManager = authManager;
    }

    @GetMapping()
    public ResponseEntity<List<GetUsuarioDTO>> getUsuarios(){
        return ResponseEntity.ok(service.getUsers());
    }

    @PostMapping("/register")
    public ResponseEntity<GetUsuarioDTO> registrarUsuario(@RequestBody UsuarioDTO dto){
        return ResponseEntity.status(201).body(service.createUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioDTO dto){
        try{
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    dto.getUsuario(),
                    dto.getPassword()
                )
            );

            UserDetails user = (UserDetails) auth.getPrincipal();

            UUID unidadId = service.getUnidadIdByUsername(user.getUsername());

            String unidadNombre = service.getUnidadByUsername(user.getUsername());

            String token = jwt.generateToken(user, unidadId);
            
            String role = user.getAuthorities().stream().toList().getFirst().toString();
            
            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), role, unidadId, unidadNombre));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<GetUsuarioDTO> updateUser(@PathVariable UUID id ,@RequestBody UsuarioDTO dto){
        return ResponseEntity.ok(service.updateUser(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id){
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
