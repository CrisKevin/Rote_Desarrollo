package com.uatf.sistema.security;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final String SECRET = "una_clave_super_segura_que_nadie_nunca_podra_descifrar_xd";

    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    public String generateToken(UserDetails user, UUID unidad_id){
        return Jwts.builder()
            .subject(user.getUsername())
            .claim("roles", user.getAuthorities()
                .stream()
                .map(a -> a.getAuthority())
                .toList()
            )
            .claim("unidad", unidad_id)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
            .signWith(getKey())
            .compact();
    }
  
    public String extractUsername(String token){
        return getClaims(token).getSubject();
    }

    public boolean isValid(String token){
        try{
            getClaims(token);
            return true;
        } catch (Exception e){
            return false;
        }
    }

    public List<String> extractRoles(String token){
        Claims claims = getClaims(token);
        List<?> misterio = claims.get("roles", List.class);
        return misterio.stream().map(Object::toString).toList();
    }

    public UUID extractUnidadId(String token){
        Claims claims = getClaims(token);
        String unidadId = claims.get("unidad", String.class);
        return UUID.fromString(unidadId);
    }

    private Claims getClaims(String token){
        return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
