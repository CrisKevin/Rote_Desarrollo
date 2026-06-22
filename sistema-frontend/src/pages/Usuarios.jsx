// src/pages/Usuarios.jsx
import { Search, Edit, Trash2, Plus, UserCircle} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { usuarioService } from '../services/usuarioService';
import { unidadService } from '../services/unidadService';
import { docenteService } from '../services/docenteService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Usuarios() {
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
    usuario: '',
    password: '',
    rol: '',
    unidad_id: '',
    docente_id: ''  // ← Agregamos docente_id al formulario
  });

  const [unidades, setUnidades] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [roles] = useState([
    { id: 'ADMIN', nombre: 'Administrador' },
    { id: 'USER', nombre: 'Usuario' }
  ]);

  const isFirstRender = useRef(true);

  // Cargar usuarios
  const cargarItems = async () => {
    setCargando(true);
    setError('');
    
    try {
      const response = await usuarioService.getAll();
      console.log('Datos de usuarios:', response.data);
      
      if (response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        const itemsOrdenados = [...data].sort((a, b) => {
          return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
        });
        setItems(itemsOrdenados);
      } else {
        setError('No se pudieron cargar los datos');
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError(err.message || 'Error al cargar datos');
    }
    
    setCargando(false);
  };

  // Cargar unidades
  const cargarUnidades = async () => {
    try {
      const response = await unidadService.getAll();
      if (response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        const unidadesOrdenadas = [...data].sort((a, b) => {
          return a.nombre.localeCompare(b.nombre);
        });
        setUnidades(unidadesOrdenadas);
      }
    } catch (error) {
      console.error('Error cargando unidades:', error);
    }
  };

  // Cargar docentes
  const cargarDocentes = async () => {
    try {
      const response = await docenteService.getAll();
      if (response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        const docentesOrdenados = [...data].sort((a, b) => {
          return a.nombres.localeCompare(b.nombres);
        });
        setDocentes(docentesOrdenados);
      }
    } catch (error) {
      console.error('Error cargando docentes:', error);
    }
  };

  // CRUD básico
  const abrirModalNuevo = () => {
    setItemEditando(null);
    setFormData({ 
      usuario: '',
      password: '',
      rol: 'USER',
      unidad_id: '',
      docente_id: ''  // ← Inicializar vacío
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (item) => {
    setItemEditando(item);
    setFormData({
      usuario: item.usuario,
      password: '',
      rol: item.rol || 'USER',
      unidad_id: item.unidad_id || '',
      docente_id: item.docente_id || ''  // ← Cargar docente asignado
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setItemEditando(null);
    setFormData({ 
      usuario: '',
      password: '',
      rol: 'USER',
      unidad_id: '',
      docente_id: ''
    });
    setErrorFormulario('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'usuario') {
      setFormData({ ...formData, [name]: value.toLowerCase().trim() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const guardarItem = async () => {
    if (!formData.usuario.trim() || !formData.unidad_id || !formData.rol) {
      setErrorFormulario('Por favor complete todos los campos obligatorios');
      return;
    }
    
    if (!itemEditando && (!formData.password || formData.password.length < 8)) {
      setErrorFormulario('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    const datosEnviar = {
      usuario: formData.usuario.toLowerCase().trim(),
      rol: formData.rol,
      unidad_id: formData.unidad_id
    };
    
    // ✅ Agregar docente_id si existe
    if (formData.docente_id) {
      datosEnviar.docente_id = formData.docente_id;
    }
    
    if (formData.password) {
      datosEnviar.password = formData.password;
    }
    
    try {
      if (itemEditando) {
        await usuarioService.actualizar(itemEditando.id, datosEnviar);
      } else {
        await usuarioService.crear(datosEnviar);
      }
      await cargarItems();
      cerrarModal();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      setErrorFormulario('Error al guardar: ' + (error.response?.data?.message || error.message));
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
    
    try {
      await usuarioService.eliminar(itemAEliminar.id);
      await cargarItems();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar: ' + (error.response?.data?.message || error.message));
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
      cargarDocentes();
    }
  }, []);

  // Filtrar items de la tabla
  const itemsFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const terminoBusqueda = searchTerm.toLowerCase();
    return items.filter((item) => {
      return (
        (item.usuario && item.usuario.toLowerCase().includes(terminoBusqueda)) ||
        (item.rol && item.rol.toLowerCase().includes(terminoBusqueda)) ||
        (item.unidad_nombre && item.unidad_nombre.toLowerCase().includes(terminoBusqueda)) ||
        (item.docente_nombre && item.docente_nombre.toLowerCase().includes(terminoBusqueda))
      );
    });
  }, [items, searchTerm]);

  // Renderizado
  if (cargando && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Usuarios</h1>
            <p className="text-gray-600 dark:text-gray-400">Cargando usuarios desde el servidor...</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-500 mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Usuarios</h1>
            <p className="text-gray-600 dark:text-gray-400">Error al conectar con el servidor</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona todos los usuarios del sistema</p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition-colors dark:text-white"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por usuario, rol, unidad o docente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Unidad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Docente Asignado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {itemsFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.usuario}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.rol === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {item.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.unidad_nombre || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.docente_id ? (
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-indigo-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.docente_nombre || 'Docente asignado'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin asignar</span>
                    )}
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
            <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
          </div>
        )}
        
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {items.length} usuarios | Mostrando: {itemsFiltrados.length}
          </p>
        </div>
      </div>

      <ModalConfirmacion 
        abierto={modalConfirmacionAbierto}
        titulo="Eliminar Usuario"
        mensaje={`¿Estás seguro de eliminar al usuario "${itemAEliminar ? itemAEliminar.usuario : ''}"? Esta acción no se puede deshacer.`}
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
          nuevo: 'Nuevo Usuario',
          editando: 'Editar Usuario'
        }}
        campos={[
          { name: 'usuario', label: 'Usuario', placeholder: 'Ej: jperez', required: true },
          { name: 'password', label: itemEditando ? 'Contraseña (dejar vacío para mantener)' : 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres', required: !itemEditando },
          { 
            name: 'rol', 
            label: 'Rol', 
            type: 'select',
            options: roles,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione un rol',
            required: true
          },
          { 
            name: 'unidad_id', 
            label: 'Unidad', 
            type: 'select',
            options: unidades,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione una unidad',
            required: true
          },
          { 
            name: 'docente_id',  // ← Nuevo campo para asignar docente
            label: 'Docente (opcional)', 
            type: 'select',
            options: docentes,
            optionLabel: (docente) => `${docente.nombres} ${docente.apellidos}`,
            optionValue: 'id',
            placeholder: 'Seleccione un docente',
            required: false
          }
        ]}
      />
    </div>
  );
}