// src/pages/Items.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { itemService } from '../services/itemService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Items() {
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

  const [formData, setFormData] = useState({
    dedicacion: '',
    item: '',
    horasAsignadas: ''
  });

  const isFirstRender = useRef(true);

  // Función para cargar items
  const cargarItems = useCallback(async () => {
    setCargando(true);
    setError('');
    
    const { data, error: errorMsg } = await itemService.getAll()
    
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
  });

  const abrirModalNuevo = () => {
    setItemEditando(null);
    setFormData({ 
      dedicacion: '',
      item: '',
      horasAsignadas: ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setItemEditando(item);
    setFormData({
      dedicacion: item.dedicacion || '',
      item: item.item || '',
      horasAsignadas: item.horasAsignadas || ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setItemEditando(null);
    setFormData({ 
      dedicacion: '',
      item: '',
      horasAsignadas: ''
    });
    setErrorFormulario('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarItem = async () => {
    if (!formData.dedicacion.trim() || !formData.item || !formData.horasAsignadas) {
      setErrorFormulario('Por favor complete todos los campos');
      return;
    }

    // Validar que item sea número positivo
    if (isNaN(formData.item) || formData.item <= 0) {
      setErrorFormulario('El ítem debe ser un número positivo');
      return;
    }

    // Validar que horasAsignadas sea número positivo
    if (isNaN(formData.horasAsignadas) || formData.horasAsignadas <= 0) {
      setErrorFormulario('Las horas asignadas deben ser un número positivo');
      return;
    }

    setErrorFormulario('');
    setCargando(true);

    const datosEnviar = {
      dedicacion: formData.dedicacion.toUpperCase().trim(),
      item: parseInt(formData.item),
      horasAsignadas: parseInt(formData.horasAsignadas)
    };

    if (itemEditando) {
      const { error } = await itemService.actualizar(itemEditando.id, datosEnviar);
      if (!error) {
        await cargarItems();
        cerrarModal();
      } else {
        setErrorFormulario('Error al actualizar: ' + error);
      }
    } else {
      const { error } = await itemService.crear(datosEnviar);
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

    const { error } = 
      itemService.eliminar(itemAEliminar.id) 

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
    }
  }, [cargarItems]);

  // Filtrar items
  const itemsFiltrados = items.filter((item) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      item.dedicacion?.toLowerCase().includes(terminoBusqueda) ||
      (item.item && item.item.toString().includes(terminoBusqueda)) ||
      (item.horasAsignadas && item.horasAsignadas.toString().includes(terminoBusqueda))
    );
  });

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Ítems
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
              Ítems
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
            Ítems
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los ítems del sistema
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition-colors dark:text-white dark:hover:bg-primary-dark/90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Ítem
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por dedicación, ítem o horas asignadas..."
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
                  Dedicación
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Ítem
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Horas Asignadas
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
                    {item.dedicacion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.item ? String(item.item).padStart(4, '0') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.horasAsignadas || '-'}
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
        titulo="Eliminar Ítem"
        mensaje={`¿Estás seguro de eliminar el ítem "${itemAEliminar ? itemAEliminar.dedicacion : ''}"? Esta acción no se puede deshacer.`}
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
          nuevo: 'Nuevo Ítem',
          editando: 'Editar Ítem'
        }}
        campos={[
          { name: 'dedicacion', 
            label: 'Dedicación', 
            type: 'select',
            options: [
              {id: 'T/C', nombre: 'T/C'},
              {id: 'T/H', nombre: "T/H"}
            ],
            optionLabel: 'nombre',
            optionValue: 'id',  
            placeholder: 'Seleccione una dedicación', 
            required: true
          },
          { name: 'item', label: 'Ítem', placeholder: 'Ej: 1011', numeric: true },
          { name: 'horasAsignadas', label: 'Horas Asignadas', placeholder: 'Ej: 40', numeric: true }
        ]}
      />
    </div>
  );
}