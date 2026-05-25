package com.uatf.sistema.controller;

import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uatf.sistema.service.ReporteService;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    private final ReporteService service;

    public ReportesController(ReporteService service){
        this.service = service;
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> pdf(@RequestParam(required = false) UUID unidadId){

        if(unidadId != null){
            System.out.println("La unidad es : " + unidadId);
        }

        try{
            byte[] pdfBytes = service.generarReportes(unidadId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reporte-asignaciones.pdf");

            return new ResponseEntity<>(pdfBytes,headers, HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/pdf/multiple")
    public ResponseEntity<byte[]> pdfMultiple(@RequestParam UUID unidadId){
        try{
            byte[] pdfBytes = service.generarReporteMultiple(unidadId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                "attachment",
                "reportes-asignaciones-multiple.pdf"
            );
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
    
}
