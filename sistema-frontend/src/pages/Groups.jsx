// src/pages/Groups.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { grupoService } from '../services/grupoService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Groups() {
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [grupoAEliminar, setGrupoAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  
  const [formData, setFormData] = useState({
    grupo: '',
    descripcion: ''
  });

  // useRef para saber si es la primera vez que se monta
  const isFirstRender = useRef(true);

  // Función para cargar grupos
  const cargarGrupos = async () => {
    setCargando(true);
    setError('');
    
    const { data, error: errorMsg } = await grupoService.getAll();
    
    if (data) {
      // Ordenar por fecha_creacion (más reciente primero)
      const gruposOrdenados = [...data].sort((a, b) => {
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      });
      setGrupos(gruposOrdenados);
    } else {
      setError(errorMsg || 'Error al cargar grupos');
    }
    
    setCargando(false);
  };

  const abrirModalNuevo = () => {
    setGrupoEditando(null);
    setFormData({ grupo: '', descripcion: '' });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (grupo) => {
    setGrupoEditando(grupo);
    setFormData({
      grupo: grupo.grupo,
      descripcion: grupo.descripcion
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setGrupoEditando(null);
    setFormData({ grupo: '', descripcion: '' });
    setErrorFormulario('');
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar (crear o actualizar)
  const guardarGrupo = async () => {
    if (!formData.grupo.trim() || !formData.descripcion.trim()) {
      setErrorFormulario('Por favor completa todos los campos');
      return;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    if (grupoEditando) {
    // Editar existente
    const { error } = await grupoService.actualizar(grupoEditando.id, formData);
    if (!error) {
      await cargarGrupos();
      cerrarModal();
    } else {
      setErrorFormulario('Error al actualizar: ' + error);
    }
  } else {
    // Crear nuevo
    const { error } = await grupoService.crear(formData);
    if (!error) {
      await cargarGrupos();
      cerrarModal();
    } else {
      setErrorFormulario('Error al crear: ' + error);
    }
  }
    
    setCargando(false);
  };

  // Eliminar grupo
// Abrir modal de confirmación para eliminar
const abrirModalEliminar = (grupo) => {
  setGrupoAEliminar(grupo);
  setModalConfirmacionAbierto(true);
};

// Ejecutar la eliminación
const confirmarEliminar = async () => {
  if (!grupoAEliminar) return;
  
  setModalConfirmacionAbierto(false);
  setCargando(true);
  
  const { error } = await grupoService.eliminar(grupoAEliminar.id);
  
  if (!error) {
    await cargarGrupos();
  } else {
    alert('Error al eliminar: ' + error);
  }
  
  setCargando(false);
  setGrupoAEliminar(null);
};

// Cerrar modal de confirmación
const cerrarModalConfirmacion = () => {
  setModalConfirmacionAbierto(false);
  setGrupoAEliminar(null);
};

  // useEffect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      cargarGrupos();
    }
  }, []);

  // Filtrar grupos
  const gruposFiltrados = grupos.filter((grupo) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      grupo.grupo.toLowerCase().includes(terminoBusqueda) ||
      grupo.descripcion.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Grupos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando grupos desde el servidor...
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
              Grupos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Error al conectar con el servidor
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">❌ {error}</p>
          <button 
            onClick={cargarGrupos}
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
            Grupos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los grupos del sistema
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Grupo
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número de grupo o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla de grupos */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Número de Grupo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Descripción
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {gruposFiltrados.map((grupo) => (
                <tr
                  key={grupo.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    Grupo {grupo.grupo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {grupo.descripcion}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button 
                        onClick={() => abrirModalEditar(grupo)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
  onClick={() => abrirModalEliminar(grupo)}
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
        
        {gruposFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron grupos
            </p>
          </div>
        )}
        
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {grupos.length} grupos | Mostrando: {gruposFiltrados.length}
          </p>
        </div>
      </div>

      <ModalConfirmacion 
  abierto={modalConfirmacionAbierto}
  titulo="Eliminar Grupo"
  mensaje={`¿Estás seguro de eliminar el grupo "${grupoAEliminar ? `Grupo ${grupoAEliminar.grupo}` : ''}"? Esta acción no se puede deshacer.`}
  onConfirmar={confirmarEliminar}
  onCancelar={cerrarModalConfirmacion}
/>

      {/* Modal */}
      <ModalFormulario 
        abierto={modalAbierto}
        grupoEditando={grupoEditando}
        formData={formData}
        onClose={cerrarModal}
        onSave={guardarGrupo}
        onInputChange={handleInputChange}
        error={errorFormulario}
      />
    </div>
  );
}