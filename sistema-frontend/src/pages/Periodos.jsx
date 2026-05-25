// src/pages/Periodos.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { periodoService } from '../services/periodoService';
import { gestionService } from '../services/gestionService';
import { tipoPeriodoService } from '../services/tipoPeriodoService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Periodos() {
  const [periodos, setPeriodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [periodoEditando, setPeriodoEditando] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [periodoAEliminar, setPeriodoAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [gestiones, setGestiones] = useState([]);
  const [tiposPeriodo, setTiposPeriodo] = useState([]);
  
  const [formData, setFormData] = useState({
    descripcion: '',
    desde: '',
    hasta: '',
    gestion_id: '',
    tipo_periodo_id: ''
  });

  const isFirstRender = useRef(true);

  // Función para cargar periodos
  const cargarPeriodos = async () => {
    setCargando(true);
    setError('');
    
    const { data, error: errorMsg } = await periodoService.getAll();
    
    if (data) {
      // Ordenar por fecha_creacion (más reciente primero)
      const periodosOrdenados = [...data].sort((a, b) => {
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      });
      setPeriodos(periodosOrdenados);
    } else {
      setError(errorMsg || 'Error al cargar periodos');
    }
    
    setCargando(false);
  };

  // Función para cargar gestiones
const cargarGestiones = async () => {
  try {
    const { data } = await gestionService.getAll();
    
    if (data && Array.isArray(data)) {
      // Transformar los datos: convertir "gestion" a "nombre"
      const gestionesProcesadas = data
        .filter(item => item && item.id)
        .map(item => ({
          id: item.id,
          nombre: item.gestion || item.nombre || 'Sin nombre', // ← Usar "gestion" como nombre
          ...item // Mantener datos originales si es necesario
        }));
      
      // Ordenar
      const gestionesOrdenadas = gestionesProcesadas.sort((a, b) => {
        try {
          return a.nombre.localeCompare(b.nombre);
        } catch (e) {
          return e;
        }
      });
      
      console.log('Gestiones procesadas:', gestionesOrdenadas);
      setGestiones(gestionesOrdenadas);
    } else {
      setGestiones([]);
    }
  } catch (error) {
    console.error('Error cargando gestiones:', error);
    setGestiones([]);
  }
};

  // Función para cargar tipos de periodo
  // Función para cargar tipos de periodo
const cargarTiposPeriodo = async () => {
  try {
    const { data } = await tipoPeriodoService.getAll();
    
    if (data && Array.isArray(data)) {
      // Transformar los datos: usar "tipo" como "nombre"
      const tiposProcesados = data
        .filter(item => item && item.id)
        .map(item => ({
          id: item.id,
          nombre: item.tipo || item.nombre || 'Sin nombre', // ← Usar "tipo" como nombre
          ...item // Mantener datos originales
        }));
      
      // Ordenar
      const tiposOrdenados = tiposProcesados.sort((a, b) => {
        try {
          return a.nombre.localeCompare(b.nombre);
        } catch (e) {
          return e;
        }
      });
      
      console.log('Tipos periodo procesados:', tiposOrdenados);
      setTiposPeriodo(tiposOrdenados);
    } else {
      setTiposPeriodo([]);
    }
  } catch (error) {
    console.error('Error cargando tipos de periodo:', error);
    setTiposPeriodo([]);
  }
};

  const abrirModalNuevo = () => {
    setPeriodoEditando(null);
    // Formato local datetime-local: YYYY-MM-DDThh:mm
    const ahora = new Date();
    const fechaHoraActual = ahora.toISOString().slice(0, 16);
    const fechaHoraManana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
    
    setFormData({ 
      descripcion: '',
      desde: fechaHoraActual,
      hasta: fechaHoraManana,
      gestion_id: '',
      tipo_periodo_id: ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (periodo) => {
    setPeriodoEditando(periodo);
    
    // Convertir ISO string a formato local datetime-local (YYYY-MM-DDThh:mm)
    const desdeFormateado = periodo.desde ? periodo.desde.slice(0, 16) : '';
    const hastaFormateado = periodo.hasta ? periodo.hasta.slice(0, 16) : '';
    
    setFormData({
      descripcion: periodo.descripcion || '',
      desde: desdeFormateado,
      hasta: hastaFormateado,
      gestion_id: periodo.gestion_id || '',
      tipo_periodo_id: periodo.tipo_periodo_id || ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPeriodoEditando(null);
    setFormData({ 
      descripcion: '',
      desde: '',
      hasta: '',
      gestion_id: '',
      tipo_periodo_id: ''
    });
    setErrorFormulario('');
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validar fechas
  const validarFechas = () => {
    if (!formData.desde || !formData.hasta) {
      setErrorFormulario('Por favor completa las fechas de inicio y fin');
      return false;
    }
    
    const desde = new Date(formData.desde);
    const hasta = new Date(formData.hasta);
    
    if (desde >= hasta) {
      setErrorFormulario('La fecha de inicio debe ser menor que la fecha de fin');
      return false;
    }
    
    return true;
  };

  // Guardar (crear o actualizar)
  const guardarPeriodo = async () => {
    if (!formData.descripcion.trim()) {
      setErrorFormulario('Por favor completa la descripción del periodo');
      return;
    }
    
    if (!formData.gestion_id) {
      setErrorFormulario('Por favor selecciona una gestión');
      return;
    }
    
    if (!formData.tipo_periodo_id) {
      setErrorFormulario('Por favor selecciona un tipo de periodo');
      return;
    }
    
    if (!validarFechas()) {
      return;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    // Formatear fechas a ISO 8601
    const datosEnviar = {
      descripcion: formData.descripcion,
      desde: formData.desde ? new Date(formData.desde).toISOString() : null,
      hasta: formData.hasta ? new Date(formData.hasta).toISOString() : null,
      gestion_id: formData.gestion_id,
      tipo_periodo_id: formData.tipo_periodo_id
    };
    
    if (periodoEditando) {
      const { error } = await periodoService.actualizar(periodoEditando.id, datosEnviar);
      if (!error) {
        await cargarPeriodos();
        cerrarModal();
      } else {
        setErrorFormulario('Error al actualizar: ' + error);
      }
    } else {
      const { error } = await periodoService.crear(datosEnviar);
      if (!error) {
        await cargarPeriodos();
        cerrarModal();
      } else {
        setErrorFormulario('Error al crear: ' + error);
      }
    }
    
    setCargando(false);
  };

  // Eliminar periodo
  const abrirModalEliminar = (periodo) => {
    setPeriodoAEliminar(periodo);
    setModalConfirmacionAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!periodoAEliminar) return;
    
    setModalConfirmacionAbierto(false);
    setCargando(true);
    
    const { error } = await periodoService.eliminar(periodoAEliminar.id);
    
    if (!error) {
      await cargarPeriodos();
    } else {
      alert('Error al eliminar: ' + error);
    }
    
    setCargando(false);
    setPeriodoAEliminar(null);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacionAbierto(false);
    setPeriodoAEliminar(null);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      cargarPeriodos();
      cargarGestiones();
      cargarTiposPeriodo();
    }
  }, []);

  // Filtrar periodos
  const periodosFiltrados = periodos.filter((periodo) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      periodo.descripcion?.toLowerCase().includes(terminoBusqueda) ||
      periodo.gestion_nombre?.toLowerCase().includes(terminoBusqueda) ||
      periodo.tipo_periodo_nombre?.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Pantalla de carga
  if (cargando && periodos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Periodos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando periodos desde el servidor...
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-500 mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Periodos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Error al conectar con el servidor
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">❌ {error}</p>
          <button 
            onClick={cargarPeriodos}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pantalla normal
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Periodos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los periodos del sistema
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Periodo
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descripción, gestión o tipo de periodo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla de periodos */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Desde
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Hasta
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Gestión
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Tipo de Periodo
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Fecha de Actualización
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {periodosFiltrados.map((periodo) => (
                <tr
                  key={periodo.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {periodo.descripcion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {periodo.desde ? new Date(periodo.desde).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {periodo.hasta ? new Date(periodo.hasta).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {periodo.gestion_nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {periodo.tipo_periodo_nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {new Date(periodo.fecha_creacion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {new Date(periodo.fecha_actualizacion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button 
                        onClick={() => abrirModalEditar(periodo)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={() => abrirModalEliminar(periodo)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {periodosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron periodos
            </p>
          </div>
        )}
        
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {periodos.length} periodos | Mostrando: {periodosFiltrados.length}
          </p>
        </div>
      </div>

      <ModalConfirmacion 
        abierto={modalConfirmacionAbierto}
        titulo="Eliminar Periodo"
        mensaje={`¿Estás seguro de eliminar el periodo "${periodoAEliminar?.descripcion || ''}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={cerrarModalConfirmacion}
      />

      {/* Modal */}
      <ModalFormulario 
        abierto={modalAbierto}
        editando={periodoEditando !== null}
        formData={formData}
        onClose={cerrarModal}
        onSave={guardarPeriodo}
        onInputChange={handleInputChange}
        error={errorFormulario}
        titulo={{
          nuevo: 'Nuevo Periodo',
          editando: 'Editar Periodo'
        }}
        campos={[
          { name: 'descripcion', label: 'Descripción', placeholder: 'Ej: Primer Semestre 2025', required: true },
          { name: 'desde', label: 'Desde', type: 'datetime-local', required: true },
          { name: 'hasta', label: 'Hasta', type: 'datetime-local', required: true },
          { 
            name: 'gestion_id', 
            label: 'Gestión', 
            type: 'select',
            options: gestiones,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione una gestión',
            required: true
          },
          { 
            name: 'tipo_periodo_id', 
            label: 'Tipo de Periodo', 
            type: 'select',
            options: tiposPeriodo,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione un tipo de periodo',
            required: true
          }
        ]}
      />
    </div>
  );
}