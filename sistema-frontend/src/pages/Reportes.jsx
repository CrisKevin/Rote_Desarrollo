// src/pages/Reportes.jsx
import { useState, useEffect } from 'react';
import { FileText, Download, Loader2, FileStack } from 'lucide-react';
import { reporteService } from '../services/reporteService';
import { unidadService } from '../services/unidadService';

export default function Reportes() {
  const [unidadesSuperiores, setUnidadesSuperiores] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [unidadSuperiorSeleccionada, setUnidadSuperiorSeleccionada] = useState('');
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
  const [cargandoUnidades, setCargandoUnidades] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [generandoMultiple, setGenerandoMultiple] = useState(false);
  const [error, setError] = useState('');

  // Cargar unidades al montar el componente
  useEffect(() => {
    const cargarUnidades = async () => {
      setCargandoUnidades(true);
      try {
        const { data, error: errorMsg } = await unidadService.getAll();
        if (data) {
          // Filtrar unidades superiores (dependiente_id == null)
          const superiores = data.filter(unidad => !unidad.dependiente_id);
          const superioresOrdenadas = [...superiores].sort((a, b) => 
            a.nombre.localeCompare(b.nombre)
          );
          setUnidadesSuperiores(superioresOrdenadas);

          // Filtrar carreras/unidades hijas (dependiente_id != null)
          const hijas = data.filter(unidad => unidad.dependiente_id);
          const hijasOrdenadas = [...hijas].sort((a, b) => 
            a.nombre.localeCompare(b.nombre)
          );
          setCarreras(hijasOrdenadas);
        } else {
          setError(errorMsg || 'Error al cargar unidades');
        }
      } catch (err) {
        console.error('Error cargando unidades:', err);
        setError('Error al cargar las unidades');
      } finally {
        setCargandoUnidades(false);
      }
    };

    cargarUnidades();
  }, []);

  const generarReporte = async (tipo = 'simple') => {
    // Verificar que al menos una unidad esté seleccionada
    if (!unidadSuperiorSeleccionada && !carreraSeleccionada) {
      setError('Por favor selecciona al menos una unidad (Superior o Carrera)');
      return;
    }
    
    // Determinar qué unidad usar (prioridad: carrera si está seleccionada)
    const unidadId = carreraSeleccionada || unidadSuperiorSeleccionada;
    
    if (tipo === 'simple') {
      setGenerando(true);
    } else {
      setGenerandoMultiple(true);
    }
    setError('');
    
    try {
      let response;
      let nombreArchivo;
      
      // Obtener el nombre de la unidad seleccionada
      const unidad = carreraSeleccionada 
        ? carreras.find(u => u.id === carreraSeleccionada)
        : unidadesSuperiores.find(u => u.id === unidadSuperiorSeleccionada);
      
      if (tipo === 'simple') {
        response = await reporteService.generarReporte(unidadId);
        nombreArchivo = 'reporte-simple';
      } else {
        response = await reporteService.generarReporteMultiple(unidadId);
        nombreArchivo = 'reporte-multiple';
      }
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      a.download = `${nombreArchivo}-${unidad?.nombre || 'unidad'}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error generando reporte:', err);
      setError(`Error al generar el reporte ${tipo === 'simple' ? 'simple' : 'múltiple'}. Intente nuevamente.`);
    } finally {
      if (tipo === 'simple') {
        setGenerando(false);
      } else {
        setGenerandoMultiple(false);
      }
    }
  };

  const handleGenerarSimple = () => {
    generarReporte('simple');
  };

  const handleGenerarMultiple = () => {
    generarReporte('multiple');
  };

  // Determinar si el botón de reporte múltiple debe estar deshabilitado
  // Solo se habilita cuando se selecciona una unidad superior (Facultad/Departamento)
  const isMultipleDisabled = !unidadSuperiorSeleccionada || cargandoUnidades || generando || generandoMultiple;

  // Determinar si el botón de reporte simple debe estar deshabilitado
  const isSimpleDisabled = cargandoUnidades || generando || generandoMultiple || (!unidadSuperiorSeleccionada && !carreraSeleccionada);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reportes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Genera reportes de asignación de docentes por unidad
          </p>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Reporte de Asignación de Docentes
            </h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Genera reportes en PDF con la lista de docentes, asignaturas, grupos y horas asignadas
            para la unidad seleccionada.
          </p>

          {/* Selector de Unidad Superior */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidad Superior (Facultad/Departamento)
            </label>
            
            {cargandoUnidades ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cargando unidades superiores...</span>
              </div>
            ) : unidadesSuperiores.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay unidades superiores registradas
              </p>
            ) : (
              <select
                value={unidadSuperiorSeleccionada}
                onChange={(e) => {
                  setUnidadSuperiorSeleccionada(e.target.value);
                  setCarreraSeleccionada(''); // Limpiar la otra selección
                }}
                className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccione una unidad superior</option>
                {unidadesSuperiores.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
              </select>
            )}
            {unidadSuperiorSeleccionada && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Unidad superior seleccionada - Reporte múltiple disponible
              </p>
            )}
          </div>

          {/* Selector de Carrera/Unidad Hija */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Carrera/Unidad Hija
            </label>
            
            {cargandoUnidades ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cargando carreras...</span>
              </div>
            ) : carreras.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay carreras o unidades hijas registradas
              </p>
            ) : (
              <select
                value={carreraSeleccionada}
                onChange={(e) => {
                  setCarreraSeleccionada(e.target.value);
                  setUnidadSuperiorSeleccionada(''); // Limpiar la otra selección
                }}
                className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccione una carrera/unidad</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            )}
            {carreraSeleccionada && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                ⚠️ Carrera seleccionada - Solo reporte simple disponible
              </p>
            )}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Botones de generación */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Botón Reporte Simple - Siempre disponible si hay unidad seleccionada */}
            <button
              onClick={handleGenerarSimple}
              disabled={isSimpleDisabled}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando PDF Simple...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Generar Reporte Simple
                </>
              )}
            </button>

            {/* Botón Reporte Múltiple - Solo disponible para unidades superiores */}
            <button
              onClick={handleGenerarMultiple}
              disabled={isMultipleDisabled}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generandoMultiple ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando PDF Múltiple...
                </>
              ) : (
                <>
                  <FileStack className="w-5 h-5" />
                  Generar Reporte Múltiple
                </>
              )}
            </button>
          </div>

          {/* Mensaje informativo sobre disponibilidad de reportes */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-400">
              📌 <strong>Nota:</strong> El reporte múltiple solo está disponible para unidades superiores (Facultades/Departamentos). 
              Para carreras o unidades hijas, solo se puede generar el reporte simple.
            </p>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Tipos de Reportes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reporte Simple */}
          <div className="space-y-2">
            <h4 className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reporte Simple
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 pl-6">
              <li>• 📄 Formato: PDF (orientación horizontal)</li>
              <li>• 👥 Incluye docentes, cargos, dedicación, grupos y asignaturas</li>
              <li>• ⏱️ Cálculo de horas totales por docente</li>
              <li>• 🏢 Disponible para TODAS las unidades</li>
            </ul>
          </div>

          {/* Reporte Múltiple */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <FileStack className="w-4 h-4" />
              Reporte Múltiple
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 pl-6">
              <li>• 📚 Genera reportes separados por cada docente</li>
              <li>• 👤 Reporte individual para cada docente con sus asignaturas</li>
              <li>• 📊 Resumen detallado por docente</li>
              <li>• 🏛️ Disponible SOLO para unidades superiores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}