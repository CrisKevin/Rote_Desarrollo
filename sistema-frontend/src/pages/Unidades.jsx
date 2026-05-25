// src/pages/Unidades.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { unidadService } from '../services/unidadService';
import { tipoUnidadService } from '../services/tipoUnidadService'
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Unidades() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    sigla: '',
    item: '',
    tipo_unidad_id: '',
    dependiente_id: ''
  });

  // Estado para selects
  const [tiposUnidad, setTiposUnidad] = useState([]);
  const [unidadesDisponibles, setUnidadesDisponibles] = useState([]);

  const isFirstRender = useRef(true);

  // Función para cargar unidades
  const cargarItems = async () => {
    setCargando(true);
    setError('');
    
    const { data, error: errorMsg } = await unidadService.getAll();
    
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
  };

  // Función para cargar tipos de unidad
  const cargarTiposUnidad = async () => {
    try {
      const { data } = await tipoUnidadService.getAll();
      if (data) {
        const tiposOrdenados = [...data].sort((a, b) => {
          return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
        });
        setTiposUnidad(tiposOrdenados);
      }
    } catch (error) {
      console.error('Error cargando tipos de unidad:', error);
    }
  };

  // Función para cargar unidades disponibles (para el select de dependiente)
  const cargarUnidadesDisponibles = async () => {
    try {
      const { data } = await unidadService.getAll();
      if (data) {
        const unidadesOrdenadas = [...data].sort((a, b) => {
          return a.nombre.localeCompare(b.nombre);
        });
        setUnidadesDisponibles(unidadesOrdenadas);
      }
    } catch (error) {
      console.error('Error cargando unidades disponibles:', error);
    }
  };

  const abrirModalNuevo = () => {
    setItemEditando(null);
    setFormData({ 
      nombre: '',
      sigla: '',
      item: '',
      tipo_unidad_id: '',
      dependiente_id: ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setItemEditando(item);
    setFormData({
      nombre: item.nombre,
      sigla: item.sigla || '',
      item: item.item || '',
      tipo_unidad_id: item.tipo_unidad_id || '',
      dependiente_id: item.dependiente_id || ''
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
      item: '',
      tipo_unidad_id: '',
      dependiente_id: ''
    });
    setErrorFormulario('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarItem = async () => {
    if (!formData.nombre.trim() || !formData.tipo_unidad_id) {
      setErrorFormulario('Por favor completa los campos obligatorios (Nombre y Tipo de Unidad)');
      return;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    // Preparar datos para enviar
    const datosEnviar = {
      nombre: formData.nombre,
      sigla: formData.sigla,
      item: formData.item ? parseInt(formData.item) : null,
      tipo_unidad_id: formData.tipo_unidad_id,
      dependiente_id: formData.dependiente_id || null
    };
    
    if (itemEditando) {
      const { error } = await unidadService.actualizar(itemEditando.id, datosEnviar);
      if (!error) {
        await cargarItems();
        await cargarUnidadesDisponibles(); // Recargar para actualizar selects
        cerrarModal();
      } else {
        setErrorFormulario('Error al actualizar: ' + error);
      }
    } else {
      const { error } = await unidadService.crear(datosEnviar);
      if (!error) {
        await cargarItems();
        await cargarUnidadesDisponibles(); // Recargar para actualizar selects
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
    
    const { error } = await unidadService.eliminar(itemAEliminar.id);
    
    if (!error) {
      await cargarItems();
      await cargarUnidadesDisponibles();
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
      cargarTiposUnidad();
      cargarUnidadesDisponibles();
    }
  }, []);

  // Filtrar items
  const itemsFiltrados = items.filter((item) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      item.nombre.toLowerCase().includes(terminoBusqueda) ||
      (item.sigla && item.sigla.toLowerCase().includes(terminoBusqueda)) ||
      (item.tipo_unidad_nombre && item.tipo_unidad_nombre.toLowerCase().includes(terminoBusqueda)) ||
      (item.dependiente_nombre && item.dependiente_nombre.toLowerCase().includes(terminoBusqueda))
    );
  });

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Unidades
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando unidades desde el servidor...
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
              Unidades
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
            Unidades
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todas las unidades del sistema
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Unidad
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, sigla, tipo de unidad o unidad de la que depende..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla de unidades */}
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
                  Item
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Tipo de Unidad
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Depende de
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
                    {item.item || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.tipo_unidad_nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.dependiente_nombre || '-'}
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
              No se encontraron unidades
            </p>
          </div>
        )}
        
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {items.length} unidades | Mostrando: {itemsFiltrados.length}
          </p>
        </div>
      </div>

      <ModalConfirmacion 
        abierto={modalConfirmacionAbierto}
        titulo="Eliminar Unidad"
        mensaje={`¿Estás seguro de eliminar la unidad "${itemAEliminar ? itemAEliminar.nombre : ''}"? Esta acción no se puede deshacer.`}
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
          nuevo: 'Nueva Unidad',
          editando: 'Editar Unidad'
        }}
        campos={[
          { name: 'nombre', label: 'Nombre', placeholder: 'Ej: Vicerrectorado, Ingeniería de Sistemas...', required: true },
          { name: 'sigla', label: 'Sigla', placeholder: 'Ej: VICE, SIS...' },
          { name: 'item', label: 'Item', placeholder: 'Ej: 1000', type: 'number' },
          { 
            name: 'tipo_unidad_id', 
            label: 'Tipo de Unidad', 
            type: 'select',
            options: tiposUnidad,
            optionLabel: 'tipo',
            optionValue: 'id',
            placeholder: 'Seleccione un tipo de unidad',
            required: true
          },
          { 
            name: 'dependiente_id', 
            label: 'Depende de (Unidad superior)', 
            type: 'select',
            options: unidadesDisponibles.filter(u => u.id !== (itemEditando?.id)), // No puede depender de sí misma
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione una unidad (opcional)'
          }
        ]}
      />
    </div>
  );
}