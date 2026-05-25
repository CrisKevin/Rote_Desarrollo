package com.uatf.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UsuarioDTO {

    private String usuario;
    private String rol;
    private String password;

}
