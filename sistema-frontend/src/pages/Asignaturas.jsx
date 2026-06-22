// src/pages/Asignaturas.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef, useCallback} from 'react';
import { asignaturaService } from '../services/asignaturaService';
import { unidadService } from '../services/unidadService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Asignaturas() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [unidades, setUnidades] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role || 'ROLE_USER';
  const isAdmin = userRole === 'ROLE_ADMIN';

  
  const [formData, setFormData] = useState({
    nombre: '',
    sigla: '',
    horas_asignadas: '',
    unidad_id: ''
  });

  const isFirstRender = useRef(true);

  // Función para cargar asignaturas
  const cargarItems = useCallback( async () => {
    setCargando(true);
    setError('');
    
    const { data, error: errorMsg } = isAdmin? await asignaturaService.getAll() : await asignaturaService.getAllActive();
    
    if (data) {
      // Ordenar por fecha_creacion (más reciente primero)
      const itemsOrdenados = [...data].sort((a, b) => {
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      });
      setItems(itemsOrdenados);
    } else {
      setError(errorMsg || 'Error al cargar datos');
    }
    
    setCargando(false);
  },[isAdmin]);

  // Función para cargar unidades
  const cargarUnidades = useCallback(async () => {
    try {
      const { data } = isAdmin? await unidadService.getAll() : await unidadService.getAllActive();
      if (data) {
        const unidadesOrdenadas = [...data].sort((a, b) => {
          return a.nombre.localeCompare(b.nombre);
        });
        setUnidades(unidadesOrdenadas);
      }
    } catch (error) {
      console.error('Error cargando unidades:', error);
    }
  },[isAdmin]);

  const abrirModalNuevo = () => {
    setItemEditando(null);
    setFormData({ 
      nombre: '', 
      sigla: '', 
      horas_asignadas: '',
      unidad_id: ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setItemEditando(item);

    let horasAsignadas = '';
    if (item.horas_asignadas) {
    const partes = item.horas_asignadas.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    horasAsignadas = horas + (minutos / 60);
    }

    setFormData({
      nombre: item.nombre,
      sigla: item.sigla || '',
      horas_asignadas: horasAsignadas || '',
      unidad_id: item.unidad_id || ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setItemEditando(null);
    setFormData({ 
      nombre: '', 
      sigla: '', 
      horas_asignadas: '',
      unidad_id: ''
    });
    setErrorFormulario('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarItem = async () => {
    if (!formData.nombre.trim() || !formData.sigla.trim() || !formData.horas_asignadas || !formData.unidad_id) {
      setErrorFormulario('Por favor complete todos los campos');
      return;
    }
    
    // Validar horas_asignadas (opcional) - debe ser número positivo
    if (formData.horas_asignadas && (isNaN(formData.horas_asignadas) || formData.horas_asignadas <= 0)) {
      setErrorFormulario('Las horas asignadas deben ser un número positivo');
      return;
    }

    // Convertir horas a formato HH:MM:SS para el backend
    let horasAsignadasFormateadas = null;
    if (formData.horas_asignadas && !isNaN(formData.horas_asignadas) && formData.horas_asignadas > 0) {
      const horasFloat = parseFloat(formData.horas_asignadas);
      const horas = Math.floor(horasFloat);
      const minutos = Math.round((horasFloat - horas) * 60);
      horasAsignadasFormateadas = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    const datosEnviar = {
      nombre: formData.nombre.toUpperCase().trim(),
      sigla: formData.sigla.toUpperCase().trim() || null,
      horas_asignadas: horasAsignadasFormateadas,
      unidad_id: formData.unidad_id || null
    };
    
    if (itemEditando) {
      const { error } = await asignaturaService.actualizar(itemEditando.id, datosEnviar);
      if (!error) {
        await cargarItems();
        cerrarModal();
      } else {
        setErrorFormulario('Error al actualizar: ' + error);
      }
    } else {
      const { error } = await asignaturaService.crear(datosEnviar);
      if (!error) {
        await cargarItems();
        cerrarModal();
      } else {
        setErrorFormulario('Error al crear: ' + error);
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
    
    const { error } = isAdmin? await asignaturaService.eliminar(itemAEliminar.id) : await asignaturaService.eliminarSuave(itemAEliminar.id);
    
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
      cargarUnidades();
    }
  }, [cargarItems, cargarUnidades]);

  // Filtrar items
  const itemsFiltrados = items.filter((item) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      item.nombre.toLowerCase().includes(terminoBusqueda) ||
      (item.sigla && item.sigla.toLowerCase().includes(terminoBusqueda)) ||
      (item.unidad_nombre && item.unidad_nombre.toLowerCase().includes(terminoBusqueda))
    );
  });

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Asignaturas
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
              Asignaturas
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
            Asignaturas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todas las asignaturas del sistema
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition-colors dark:text-white dark:hover:bg-primary-dark/90"
        >
          <Plus className="w-5 h-5" />
          Nueva Asignatura
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, sigla o unidad..."
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
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Sigla
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Horas Asignadas
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Unidad
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
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {item.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.sigla || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.horas_asignadas ? `${item.horas_asignadas}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.unidad_nombre || '-'}
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
        titulo="Eliminar Asignatura"
        mensaje={`¿Estás seguro de eliminar la asignatura "${itemAEliminar ? itemAEliminar.nombre : ''}"? Esta acción no se puede deshacer.`}
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
        titulo={{
          nuevo: 'Nueva Asignatura',
          editando: 'Editar Asignatura'
        }}
        campos={[
          { name: 'nombre', label: 'Nombre', placeholder: 'Ej: Taller de Redes'},
          { name: 'sigla', label: 'Sigla', placeholder: 'Ej: SIS-625' },
          { name: 'horas_asignadas', label: 'Horas Asignadas', placeholder: 'Ej: 2', numeric: true, step:'0.5' },
          { 
            name: 'unidad_id', 
            label: 'Unidad', 
            type: 'select',
            options: unidades,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione una unidad'
          }
        ]}
      />
    </div>
  );
}