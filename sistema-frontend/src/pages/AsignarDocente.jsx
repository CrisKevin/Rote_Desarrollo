// src/pages/AsignarDocente.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { asignarDocenteService } from '../services/asignarDocenteService';
import { grupoService } from '../services/grupoService';
import { docenteService } from '../services/docenteService';
import { asignaturaService } from '../services/asignaturaService';
import { periodoService } from '../services/periodoService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function AsignarDocente() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role || 'ROLE_USER';
  const isAdmin = userRole === 'ROLE_ADMIN';
  
  // Estado para filtro de activos (solo para admin)
  const [filtroActivos, setFiltroActivos] = useState(true);
  
  // Estados para selects
  const [grupos, setGrupos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  
  const [formData, setFormData] = useState({
    grupo_id: '',
    docente_id: '',
    asignatura_id: '',
    observacion_id: '',
    periodo_id: ''
  });

  const isFirstRender = useRef(true);

  // Función para cargar asignaciones
  const cargarItems = useCallback(async () => {
    setCargando(true);
    setError('');
    
    let response;
    if (isAdmin) {
      // Admin: según el filtro
      response = filtroActivos 
        ? await asignarDocenteService.getAllActive()
        : await asignarDocenteService.getAll();
    } else {
      // Usuario normal: solo activos
      response = await asignarDocenteService.getAllActive();
    }
    
    const { data, error: errorMsg } = response;
    
    if (data) {
      // Ordenar primero por docente y luego por fecha de creación (más reciente primero)
      const itemsOrdenados = [...data].sort((a, b) => {
        // Primero ordenar por nombre de docente
        const nombreA = `${a.docente_nombre || ''} ${a.docente_apellido || ''}`.toLowerCase();
        const nombreB = `${b.docente_nombre || ''} ${b.docente_apellido || ''}`.toLowerCase();
        
        const comparacionDocente = nombreA.localeCompare(nombreB);
        
        if (comparacionDocente !== 0) {
          return comparacionDocente;
        }
        
        // Si el docente es el mismo, ordenar por fecha de creación (más reciente primero)
        const fechaA = new Date(a.fecha_creacion);
        const fechaB = new Date(b.fecha_creacion);
        return fechaB - fechaA;
      });
      setItems(itemsOrdenados);
    } else {
      setError(errorMsg || 'Error al cargar datos');
    }
    
    setCargando(false);
  }, [isAdmin, filtroActivos]);

  // Función para cargar grupos
  const cargarGrupos = useCallback(async () => {
    try {
      const { data } = isAdmin && !filtroActivos 
        ? await grupoService.getAll()
        : await grupoService.getAllActive();
      if (data) {
        const gruposOrdenados = [...data].sort((a, b) => {
          return a.grupo.localeCompare(b.grupo);
        });
        setGrupos(gruposOrdenados);
      }
    } catch (error) {
      console.error('Error cargando grupos:', error);
    }
  }, [isAdmin, filtroActivos]);

  // Función para cargar docentes
  const cargarDocentes = useCallback(async () => {
    try {
      const { data } = isAdmin && !filtroActivos 
        ? await docenteService.getAll()
        : await docenteService.getAllActive();
      if (data) {
        const docentesOrdenados = [...data].sort((a, b) => {
          return a.nombres.localeCompare(b.nombres);
        });
        setDocentes(docentesOrdenados);
      }
    } catch (error) {
      console.error('Error cargando docentes:', error);
    }
  }, [isAdmin, filtroActivos]);

  // Función para cargar asignaturas
  const cargarAsignaturas = useCallback(async () => {
    try {
      const { data } = isAdmin && !filtroActivos 
        ? await asignaturaService.getAll()
        : await asignaturaService.getAllActive();
      if (data) {
        const asignaturasOrdenadas = [...data].sort((a, b) => {
          return a.nombre.localeCompare(b.nombre);
        });
        setAsignaturas(asignaturasOrdenadas);
      }
    } catch (error) {
      console.error('Error cargando asignaturas:', error);
    }
  }, [isAdmin, filtroActivos]);

  // Función para cargar periodos
  const cargarPeriodos = useCallback(async () => {
    try {
      const { data } = isAdmin && !filtroActivos 
        ? await periodoService.getAll()
        : await periodoService.getAllActive();
      if (data) {
        const periodosOrdenados = [...data].sort((a, b) => {
          return a.descripcion.localeCompare(b.descripcion);
        });
        setPeriodos(periodosOrdenados);
      }
    } catch (error) {
      console.error('Error cargando periodos:', error);
    }
  }, [isAdmin, filtroActivos]);

  const abrirModalNuevo = () => {
    setItemEditando(null);
    setFormData({ 
      grupo_id: '',
      docente_id: '',
      asignatura_id: '',
      observacion_id: '',
      periodo_id: ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setItemEditando(item);
    setFormData({
      grupo_id: item.grupo_id || '',
      docente_id: item.docente_id || '',
      asignatura_id: item.asignatura_id || '',
      observacion_id: item.observacion_descripcion || '',
      periodo_id: item.periodo_id || ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setItemEditando(null);
    setFormData({ 
      grupo_id: '',
      docente_id: '',
      asignatura_id: '',
      observacion_id: '',
      periodo_id: ''
    });
    setErrorFormulario('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarItem = async () => {
    if (!formData.grupo_id || !formData.docente_id || !formData.asignatura_id || !formData.periodo_id) {
      setErrorFormulario('Por favor complete los campos obligatorios');
      return;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    const datosEnviar = {
      grupo_id: formData.grupo_id,
      docente_id: formData.docente_id,
      asignatura_id: formData.asignatura_id,
      observacion_descripcion: formData.observacion_id || null,
      periodo_id: formData.periodo_id || null
    };
    
    if (itemEditando) {
      const result = await asignarDocenteService.actualizar(itemEditando.id, datosEnviar);
      if (!result.error) {
        await cargarItems();
        cerrarModal();
      } else {
        try {
            const errorObj = JSON.parse(result.error);
            const mensajeError = errorObj.error || result.error;
            setErrorFormulario('Error al actualizar: ' + mensajeError);
        } catch {
            setErrorFormulario('Error al actualizar: ' + result.error);
        }
      }
    } else {
      const result = await asignarDocenteService.crear(datosEnviar);
      if (!result.error) {
        await cargarItems();
        cerrarModal();
      } else {
        try {
            const errorObj = JSON.parse(result.error);
            const mensajeError = errorObj.error || result.error;
            setErrorFormulario('Error al crear: ' + mensajeError);
        } catch {
            setErrorFormulario('Error al crear: ' + result.error);
        }
      }
    }
    
    setCargando(false);
  };

  const abrirModalEliminar = (item) => {
    setItemAEliminar(item);
    setModalConfirmacionAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!itemAEliminar) return;
    
    setModalConfirmacionAbierto(false);
    setCargando(true);
    
    const { error } = isAdmin 
      ? await asignarDocenteService.eliminar(itemAEliminar.id)
      : await asignarDocenteService.eliminarSuave(itemAEliminar.id);
    
    if (!error) {
      await cargarItems();
    } else {
      alert('Error al eliminar: ' + error);
    }
    
    setCargando(false);
    setItemAEliminar(null);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacionAbierto(false);
    setItemAEliminar(null);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      cargarItems();
      cargarGrupos();
      cargarDocentes();
      cargarAsignaturas();
      cargarPeriodos();
    }
  }, [filtroActivos, cargarItems, cargarGrupos, cargarDocentes, cargarAsignaturas, cargarPeriodos]);

  // Efecto para recargar cuando cambia el filtro
  useEffect(() => {
    if (!isFirstRender.current) {
      cargarItems();
      cargarGrupos();
      cargarDocentes();
      cargarAsignaturas();
      cargarPeriodos();
    }
  }, [filtroActivos, cargarItems, cargarGrupos, cargarDocentes, cargarAsignaturas, cargarPeriodos]);

  // Filtrar items (sin modificar el orden original que ya viene ordenado)
  const itemsFiltrados = items.filter((item) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      (item.grupo_nombre && item.grupo_nombre.toLowerCase().includes(terminoBusqueda)) ||
      (item.docente_nombre && item.docente_nombre.toLowerCase().includes(terminoBusqueda)) ||
      (item.docente_apellido && item.docente_apellido.toLowerCase().includes(terminoBusqueda)) ||
      (item.asignatura_nombre && item.asignatura_nombre.toLowerCase().includes(terminoBusqueda)) ||
      (item.periodo_descripcion && item.periodo_descripcion.toLowerCase().includes(terminoBusqueda)) ||
      (item.observacion_descripcion && item.observacion_descripcion.toLowerCase().includes(terminoBusqueda))
    );
  });

  // Pantalla de carga
  if (cargando && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Asignación de Docentes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando datos desde el servidor...
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
              Asignación de Docentes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Error al conectar con el servidor
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">❌ {error}</p>
          <button 
            onClick={cargarItems}
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
            Asignación de Docentes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Asigna docentes a grupos y asignaturas
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition-colors dark:text-white dark:hover:bg-primary-dark/90"
        >
          <Plus className="w-5 h-5" />
          Nueva Asignación
        </button>
      </div>

      {/* Selector de filtro - solo visible para admin */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mostrar:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroActivos(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filtroActivos 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Solo Activos
              </button>
              <button
                onClick={() => setFiltroActivos(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !filtroActivos 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Ver Todos (incluye inactivos)
              </button>
            </div>
            {!filtroActivos && (
              <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                Modo administrador - Mostrando todos los registros
              </span>
            )}
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por grupo, docente, asignatura, período u observación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Grupo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Docente
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Asignatura
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Observación
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Período
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
              {itemsFiltrados.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    item.estado === false ? 'opacity-60 bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {item.grupo_nombre || '-'}
                    {item.estado === false && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.docente_nombre ? `${item.docente_nombre} ${item.docente_apellido || ''}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.asignatura_nombre ? (
                      <span>
                        {item.asignatura_nombre}
                        {item.unidad_nombre && (
                          <span className="text-gray-400 text-xs block">
                            ({item.unidad_nombre})
                          </span>
                        )}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.observacion_descripcion || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.periodo_descripcion || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {new Date(item.fecha_creacion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {new Date(item.fecha_actualizacion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button 
                        onClick={() => abrirModalEditar(item)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={() => abrirModalEliminar(item)}
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
        
        {itemsFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron resultados
            </p>
          </div>
        )}
        
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {items.length} registros | Mostrando: {itemsFiltrados.length}
          </p>
        </div>
      </div>

      <ModalConfirmacion 
        abierto={modalConfirmacionAbierto}
        titulo="Eliminar Asignación"
        mensaje={`¿Estás seguro de eliminar esta asignación? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={cerrarModalConfirmacion}
      />

      <ModalFormulario 
        abierto={modalAbierto}
        editando={itemEditando !== null}
        formData={formData}
        onClose={cerrarModal}
        onSave={guardarItem}
        onInputChange={handleInputChange}
        error={errorFormulario}
        columns={2}
        titulo={{
          nuevo: 'Nueva Asignación',
          editando: 'Editar Asignación'
        }}
        campos={[
          { 
            name: 'grupo_id', 
            label: 'Grupo', 
            type: 'select',
            options: grupos,
            optionLabel: 'grupo',
            optionValue: 'id',
            placeholder: 'Seleccione un grupo',
            required: true
          },
          { 
            name: 'docente_id', 
            label: 'Docente', 
            type: 'select',
            options: docentes,
            optionLabel: (option) => `${option.nombres} ${option.apellidos}`,
            optionValue: 'id',
            placeholder: 'Seleccione un docente',
            required: true
          },
          { 
            name: 'asignatura_id', 
            label: 'Asignatura', 
            type: 'select',
            options: asignaturas,
            optionLabel: (option) => `${option.nombre} (${option.unidad_nombre || 'Sin unidad'})`,
            optionValue: 'id',
            placeholder: 'Seleccione una asignatura',
            required: true
          },
          { 
            name: 'periodo_id', 
            label: 'Período', 
            type: 'select',
            options: periodos,
            optionLabel: 'descripcion',
            optionValue: 'id',
            placeholder: 'Seleccione un período',
            required: true
          },
          { 
            name: 'observacion_id', 
            label: 'Observación', 
            placeholder: 'Observaciones adicionales',
            type: 'textarea'
          }
        ]}
      />
    </div>
  );
}