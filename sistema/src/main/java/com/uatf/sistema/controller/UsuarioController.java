package com.uatf.sistema.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uatf.sistema.dto.AuthResponse;
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

    @PostMapping("/register")
    public void registrarUsuario(@RequestBody UsuarioDTO dto){
        service.createUser(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UsuarioDTO dto){
        try{
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    dto.getUsuario(),
                    dto.getPassword()
                )
            );

            UserDetails user = (UserDetails) auth.getPrincipal();

            String token = jwt.generateToken(user);
            
            String role = user.getAuthorities().stream().toList().getFirst().toString();
            
            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), role));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                .body(new AuthResponse(null, null, "Credenciales Incorrectas"));
        }
    }
}
