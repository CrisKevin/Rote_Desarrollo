package com.uatf.sistema.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.uatf.sistema.dto.ReporteUnidadDTO;
import com.uatf.sistema.dto.ReportesDTO;
import com.uatf.sistema.exceptions.ResourceNotFoundException;
import com.uatf.sistema.model.Unidad;
import com.uatf.sistema.repository.AsignaturaDocenteRepository;
import com.uatf.sistema.repository.UnidadRepository;

@Service
public class ReporteService {

    private final AsignaturaDocenteRepository repo;
    private final TemplateEngine engine;
    private final UnidadRepository unidad_repo;

    public ReporteService(AsignaturaDocenteRepository repo, TemplateEngine engine, UnidadRepository unidad_repo){
        this.repo = repo;
        this.engine = engine;
        this.unidad_repo = unidad_repo;
    }

    public byte[] generarReportes(UUID unidadId) throws Exception {

        List<ReportesDTO> reportes = repo.obtenerAsignacionesFiltradas(unidadId);
        Unidad unidad = unidad_repo.findById(unidadId)
            .orElseThrow(() -> new ResourceNotFoundException("No se encontro la unidad"));

        System.out.println(reportes);

        System.out.println("Total en lista: " + reportes.size());

        String nombreUnidad = reportes.isEmpty() ? "Sin unidad" : reportes.getFirst().getUnidadNombre();
        String gestion = reportes.isEmpty() ? "Sin unidad" : reportes.getFirst().getGestion();
        String periodo = reportes.isEmpty() ? "Sin semestre" : reportes.getFirst().getPeriodoDescripcion();
        String reparticion = unidad.getUnidad() == null ? unidad.getNombre() : unidad.getUnidad().getNombre();
        String items = unidad.getItem().toString();

        Map<String, List<ReportesDTO>> reportesPorDocente = new LinkedHashMap<>();
        Map<String, Integer> totalHorasPorDocente = new LinkedHashMap<>();
        
        for(ReportesDTO reporte : reportes){
            String docente = reporte.getDocenteNombre() + " " + reporte.getDocenteApellido();
            reportesPorDocente.computeIfAbsent(docente, k -> new ArrayList<>()).add(reporte);
            Integer horas = reporte.getHoras() != null ? reporte.getHoras() : 0;
            totalHorasPorDocente.put(docente, totalHorasPorDocente.getOrDefault(docente, 0) + horas);
        }

        System.out.println(reportesPorDocente);

        Context context = new Context();

        LocalDate fechaActual = LocalDate.now();
        String anio = String.valueOf(fechaActual.getYear());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d 'de' MMMM 'del' yyyy", Locale.of("es","ES"));
        String fechaFormateada = fechaActual.format(formatter);

        String[] meses = {"ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
            "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"};
        
        String mesEspanol = meses[fechaActual.getMonthValue() - 1];

        ReporteUnidadDTO bloque = new ReporteUnidadDTO(nombreUnidad, gestion, periodo, reparticion, items, reportesPorDocente, totalHorasPorDocente);

        context.setVariable("mes", mesEspanol.toUpperCase()); 
        context.setVariable("anio", anio);  
        context.setVariable("fechaFormateada", fechaFormateada);
        context.setVariable("bloque", bloque);

        String html = engine.process("reporte-asignaciones", context);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.withHtmlContent(html, null);
        builder.toStream(outputStream);
        builder.run();

        for (int i = 0; i < reportes.size(); i++) {
            System.out.println(i + ": " + reportes.get(i).getUnidadNombre() 
                + " - " + reportes.get(i).getDocenteNombre());
        }

        return outputStream.toByteArray();
    }

    public byte[] generarReporteMultiple(UUID unidadId) throws Exception{
        
        Unidad superior = unidad_repo.findById(unidadId)
            .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada"));

        List<Unidad> unidades = unidad_repo.findByUnidad(superior);

        List<ReporteUnidadDTO> bloques = new ArrayList<>();

        for(Unidad u : unidades){
            List<ReportesDTO> reportes = repo.obtenerAsignacionesFiltradas(u.getId());

            Map<String, List<ReportesDTO>> reportesPorDocente = new LinkedHashMap<>();
            Map<String, Integer> totalHorasPorDocente = new LinkedHashMap<>();

            for(ReportesDTO r : reportes){
                String docente = r.getDocenteNombre() + " " + r.getDocenteApellido();
                reportesPorDocente
                    .computeIfAbsent(docente, k -> new ArrayList<>())
                    .add(r);
                
                int horas = r.getHoras() != null ? r.getHoras() : 0;

                totalHorasPorDocente.put(
                    docente,
                    totalHorasPorDocente.getOrDefault(docente, 0) + horas
                );
            }

            ReporteUnidadDTO bloque = new ReporteUnidadDTO(
                u.getNombre(),
                reportes.isEmpty() ? "-" : reportes.get(0).getGestion(),
                reportes.isEmpty() ? "-" : reportes.get(0).getPeriodoDescripcion(),
                u.getUnidad() == null ? u.getNombre(): u.getUnidad().getNombre(), 
                u.getItem().toString(),
                reportesPorDocente,
                totalHorasPorDocente
            );

            bloques.add(bloque);
        }

        Context context = new Context();

        LocalDate fechaActual = LocalDate.now();
        String anio = String.valueOf(fechaActual.getYear());
        String[] meses = {"ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
          "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"};
        String mes = meses[fechaActual.getMonthValue() - 1];
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
            "d 'de' MMMM 'del' yyyy", Locale.of("es","ES")
        );
        context.setVariable("bloques", bloques);
        context.setVariable("mes", mes);
        context.setVariable("anio", anio);
        context.setVariable("fechaFormateada", fechaActual.format(formatter));

        String html = engine.process("reportes-asignaciones-multiple", context);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.withHtmlContent(html, null);
        builder.toStream(outputStream);
        builder.run();

        return outputStream.toByteArray();
    }
}
