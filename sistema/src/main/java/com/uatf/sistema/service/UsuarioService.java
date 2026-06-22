package com.uatf.sistema.service;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uatf.sistema.dto.GetUsuarioDTO;
import com.uatf.sistema.dto.UsuarioDTO;
import com.uatf.sistema.exceptions.DuplicateResourceException;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.model.Docente;
import com.uatf.sistema.model.Unidad;
import com.uatf.sistema.model.Usuario;
import com.uatf.sistema.repository.DocenteRepository;
import com.uatf.sistema.repository.UnidadRepository;
import com.uatf.sistema.repository.UsuarioRepository;


@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final UnidadRepository unidad_repo;
    private final DocenteRepository docente_repo;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder encoder, UnidadRepository unidad_repo, DocenteRepository docente_repo){
        this.repo = repo;
        this.encoder = encoder;
        this.unidad_repo = unidad_repo;
        this.docente_repo = docente_repo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = repo.findByUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario " + username + " no encontrado"));
   
        return new User(usuario.getUsuario(), usuario.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol())));
          
    }

    public GetUsuarioDTO createUser(UsuarioDTO dto){
        
        if(dto.getPassword().isEmpty() || dto.getPassword().length() < 8)
            throw new IllegalArgumentException("Ingrese una contraseña mas segura");

        String passwordEncrypted = encoder.encode(dto.getPassword());

        Usuario usuario = new Usuario();

        Unidad unidad = unidad_repo.findById(dto.getUnidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("No se encontro la unidad"));

        Docente docente = docente_repo.findById(dto.getDocente_id())
            .orElseThrow(() -> new ResourceNotFoundException("No se encontro el docente"));

        usuario.setUsuario(dto.getUsuario());
        usuario.setPassword(passwordEncrypted);
        usuario.setRol(dto.getRol());
        usuario.setDocente(docente);

        usuario.setUnidad(unidad);
        try{
            repo.save(usuario);
            return new GetUsuarioDTO(usuario.getId(), usuario.getUsuario(), usuario.getRol(), usuario.getUnidad().getId(), usuario.getUnidad().getNombre(), 
            usuario.getDocente().getId(), usuario.getDocente().getNombres(), usuario.getFecha_actualizacion(), usuario.getFecha_creacion());
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un Usuario con este username");
        }

    }

    public List<GetUsuarioDTO> getUsers(){

        List<GetUsuarioDTO> usuarios = repo.findAll().stream().map(
            x -> {
            return new GetUsuarioDTO(x.getId(), x.getUsuario(), x.getRol(),x.getUnidad().getId(), x.getUnidad().getNombre(), 
            x.getDocente().getId(), x.getDocente().getNombres(), x.getFecha_actualizacion(), x.getFecha_creacion());
           } 
        ).toList();

        return usuarios;

    }

    public GetUsuarioDTO updateUser(UsuarioDTO dto, UUID id){

        Usuario user = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No se encontro al usuario"));

        Unidad unidad = unidad_repo.findById(dto.getUnidad_id())
            .orElseThrow(() -> new ResourceNotFoundException("No se encontro la unidad"));

        Docente docente = docente_repo.findById(dto.getDocente_id())
            .orElseThrow(() -> new ResourceNotFoundException("No se encontro docente"));

        if(dto.getPassword() != null && !dto.getPassword().isEmpty()){
            if(dto.getPassword().length() > 8){
                String passwordEncripted = encoder.encode(dto.getPassword());
                user.setPassword(passwordEncripted);
            }else{
                throw new IllegalArgumentException("Ingrese una contraseña mas segura");
            }
        }
        
        user.setUsuario(dto.getUsuario());
        user.setRol(dto.getRol());
        user.setUnidad(unidad);
        user.setDocente(docente);


        try{
            repo.save(user);
            return new GetUsuarioDTO(user.getId(), user.getUsuario(), user.getRol(), user.getUnidad().getId(), user.getUnidad().getNombre(),
            user.getDocente().getId(), user.getDocente().getNombres(), user.getFecha_actualizacion(), user.getFecha_creacion());
        }catch(DataIntegrityViolationException e){
            throw new DuplicateResourceException("Ya existe un usuario con este nombre");
        }
    }

    public void deleteUser(UUID id){
        repo.deleteById(id);
    }

    public UUID getUnidadIdByUsername(String username){
        Usuario usuario = repo.findByUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario " + username + " no encontrado"));

        return usuario.getUnidad().getId();
    }

    public String getUnidadByUsername(String username){
        Usuario usuario = repo.findByUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario " + username + " no encontrado"));

        return usuario.getUnidad().getNombre();
    }

}
