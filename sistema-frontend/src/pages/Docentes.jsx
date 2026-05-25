// src/pages/Docentes.jsx
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { docenteService } from '../services/docenteService';
import { unidadService } from '../services/unidadService';
import { tipoCargoService } from '../services/tipoCargoService';
import ModalFormulario from '../components/ModalFormulario';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [docenteEditando, setDocenteEditando] = useState(null);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [docenteAEliminar, setDocenteAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [tiposCargo, setTiposCargo] = useState([]);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    ci: '',
    observaciones: '',
    dedicacion: '',
    tipo_docente_id: '',
    cargo_docente_id: '',
    cargo_tipo_id: '',
    unidad_id: '',
  });

  const isFirstRender = useRef(true);

  const cargosDisponibles = (() => {
    if (!formData.tipo_docente_id || tiposCargo.length === 0) {
      return [];
    }

    const cargosFiltrados = tiposCargo.filter(
      (tc) => tc.tipo_docente_id === formData.tipo_docente_id
    );

    const cargosUnicos = [];
    const idsVistos = new Set();

    cargosFiltrados.forEach((cargo) => {
      if (!idsVistos.has(cargo.cargo_docente_id)) {
        idsVistos.add(cargo.cargo_docente_id);
        cargosUnicos.push({
          id: cargo.cargo_docente_id,
          nombre: cargo.cargo_docente_nombre
        });
      }
    });
      

    return cargosUnicos;
  })();

  // Función para cargar docentes
  const cargarDocentes = async () => {
    setCargando(true);
    setError('');
    
    const { data, error: errorMsg } = await docenteService.getAll();
    
    if (data) {
      // Ordenar por fecha_creacion (más reciente primero)
      const docentesOrdenados = [...data].sort((a, b) => {
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
      });
      setDocentes(docentesOrdenados);
    } else {
      setError(errorMsg || 'Error al cargar docentes');
    }
    
    setCargando(false);
  };

  // Función para cargar unidades
  const cargarUnidades = async () => {
    try {
      const { data } = await unidadService.getAll();
      if (data) {
        const unidadesOrdenadas = [...data].sort((a, b) => {
          return a.nombre.localeCompare(b.nombre);
        });
        setUnidades(unidadesOrdenadas);
      }
    } catch (error) {
      console.error('Error cargando unidades:', error);
    }
  };

  // Función para cargar tipos de cargo
  const cargarTiposCargo = async () => {
    try {
      const { data } = await tipoCargoService.getAll();
      if (data) {
        const tiposOrdenados = [...data].sort((a, b) => {
          return new Date(a.fecha_creacion) - new Date(b.fecha_creacion);
        });
        setTiposCargo(tiposOrdenados);
      }
    } catch (error) {
      console.error('Error cargando tipos de cargo:', error);
    }
  };

  const abrirModalNuevo = () => {
    setDocenteEditando(null);
    setFormData({ 
      nombres: '', 
      apellidos: '', 
      ci: '', 
      observaciones: '',
      dedicacion: '',
      tipo_docente_id: '',
      cargo_docente_id: '',
      cargo_tipo_id: '',
      unidad_id: ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (docente) => {
    setDocenteEditando(docente);

    const relacionEncontrada = tiposCargo.find(
    tc => tc.id === docente.cargo_tipo_id
    );

    setFormData({
      nombres: docente.nombres,
      apellidos: docente.apellidos,
      ci: docente.ci,
      observaciones: docente.observaciones || '',
      dedicacion: docente.dedicacion || '',
      tipo_docente_id: relacionEncontrada?.tipo_docente_id || '',
      cargo_docente_id: relacionEncontrada?.cargo_docente_id || '',
      cargo_tipo_id: docente.cargo_tipo_id || '',
      unidad_id: docente.unidad_id || ''
    });
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setDocenteEditando(null);
    setFormData({ 
      nombres: '', 
      apellidos: '', 
      ci: '', 
      observaciones: '',
      dedicacion: '',
      tipo_docente_id: '',
      cargo_docente_id: '',
      cargo_tipo_id: '',
      unidad_id: ''
    });
    setErrorFormulario('');
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
      if (name === 'tipo_docente_id') {
        // Limpiar cargo seleccionado
        setFormData({ 
          ...formData, 
          tipo_docente_id: value, 
          cargo_docente_id: '' 
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
  };

  // Guardar (crear o actualizar)
  const guardarDocente = async () => {
    if (!formData.nombres.trim() || !formData.apellidos.trim() || !formData.ci.trim()) {
      setErrorFormulario('Por favor completa los campos obligatorios (Nombres, Apellidos y CI)');
      return;
    }
    
    setErrorFormulario('');
    setCargando(true);
    
    // Buscar el ID de la relación tipo_cargo
    const relacionEncontrada = tiposCargo.find(
      tc => tc.tipo_docente_id === formData.tipo_docente_id && 
            tc.cargo_docente_id === formData.cargo_docente_id
    );
    
    const datosEnviar = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      ci: formData.ci,
      observaciones: formData.observaciones,
      dedicacion: formData.dedicacion,
      cargo_tipo_id: relacionEncontrada?.id || null,
      unidad_id: formData.unidad_id || null
    };
    
    if (docenteEditando) {
      const { error } = await docenteService.actualizar(docenteEditando.id, datosEnviar);
      if (!error) {
        await cargarDocentes();
        cerrarModal();
      } else {
        setErrorFormulario('Error al actualizar: ' + error);
      }
    } else {
      const { error } = await docenteService.crear(datosEnviar);
      if (!error) {
        await cargarDocentes();
        cerrarModal();
      } else {
        setErrorFormulario('Error al crear: ' + error);
      }
    }
    
    setCargando(false);
  };

  // Eliminar docente
  const abrirModalEliminar = (docente) => {
    setDocenteAEliminar(docente);
    setModalConfirmacionAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!docenteAEliminar) return;
    
    setModalConfirmacionAbierto(false);
    setCargando(true);
    
    const { error } = await docenteService.eliminar(docenteAEliminar.id);
    
    if (!error) {
      await cargarDocentes();
    } else {
      alert('Error al eliminar: ' + error);
    }
    
    setCargando(false);
    setDocenteAEliminar(null);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacionAbierto(false);
    setDocenteAEliminar(null);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      cargarDocentes();
      cargarUnidades();
      cargarTiposCargo();
    }
  }, []);

  // Filtrar docentes
  const docentesFiltrados = docentes.filter((docente) => {
    const terminoBusqueda = searchTerm.toLowerCase();
    return (
      docente.nombres?.toLowerCase().includes(terminoBusqueda) ||
      docente.apellidos?.toLowerCase().includes(terminoBusqueda) ||
      docente.ci?.toLowerCase().includes(terminoBusqueda) ||
      docente.tipo_docente_nombre?.toLowerCase().includes(terminoBusqueda) ||
      docente.cargo_docente_nombre?.toLowerCase().includes(terminoBusqueda) ||
      docente.unidad_nombre?.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Docentes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando docentes desde el servidor...
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
              Docentes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Error al conectar con el servidor
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">❌ {error}</p>
          <button 
            onClick={cargarDocentes}
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
            Docentes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los docentes del sistema
          </p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Docente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombres, apellidos, CI, tipo de docente, cargo o unidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla de docentes */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Nombres
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Apellidos
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  CI
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Tipo de Docente
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Dedicación
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
              {docentesFiltrados.map((docente) => (
                <tr
                  key={docente.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {docente.nombres}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.apellidos}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.ci}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.tipo_docente_nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.cargo_docente_nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.unidad_nombre || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.observaciones || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {docente.dedicacion || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {new Date(docente.fecha_creacion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {new Date(docente.fecha_actualizacion).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <button 
                        onClick={() => abrirModalEditar(docente)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button 
                        onClick={() => abrirModalEliminar(docente)}
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
        
        {docentesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron docentes
            </p>
          </div>
        )}
        
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total: {docentes.length} docentes | Mostrando: {docentesFiltrados.length}
          </p>
        </div>
      </div>

      <ModalConfirmacion 
        abierto={modalConfirmacionAbierto}
        titulo="Eliminar Docente"
        mensaje={`¿Estás seguro de eliminar al docente "${docenteAEliminar ? `${docenteAEliminar.nombres} ${docenteAEliminar.apellidos}` : ''}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={cerrarModalConfirmacion}
      />

      {/* Modal */}
      <ModalFormulario 
        abierto={modalAbierto}
        editando={docenteEditando !== null}
        formData={formData}
        onClose={cerrarModal}
        onSave={guardarDocente}
        onInputChange={handleInputChange}
        error={errorFormulario}
        titulo={{
          nuevo: 'Nuevo Docente',
          editando: 'Editar Docente'
        }}
        campos={[
          { name: 'nombres', label: 'Nombres', placeholder: 'Ej: Juan Carlos', required: true },
          { name: 'apellidos', label: 'Apellidos', placeholder: 'Ej: Pérez García', required: true },
          { name: 'ci', label: 'Cédula de Identidad', placeholder: 'Ej: 12345678', required: true },
          { name: 'dedicacion', label: 'Dedicación', placeholder: 'Ej: Tiempo completo, Medio tiempo' },
          { 
            name: 'tipo_docente_id', 
            label: 'Tipo de Docente', 
            type: 'select',
            options: (() => {
              const tiposUnicos = [];
              const idsVistos = new Set();
              tiposCargo.forEach(tc => {
                if (!idsVistos.has(tc.tipo_docente_id)) {
                  idsVistos.add(tc.tipo_docente_id);
                  tiposUnicos.push({
                    id: tc.tipo_docente_id,
                    nombre: tc.tipo_docente_nombre
                  });
                }
              });
              return tiposUnicos;
            })(),
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione un tipo de docente'
          },
          { 
            name: 'cargo_docente_id', 
            label: 'Cargo', 
            type: 'select',
            options: cargosDisponibles,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Primero seleccione un tipo de docente',
            disabled: !formData.tipo_docente_id
          },
          { 
            name: 'unidad_id', 
            label: 'Unidad', 
            type: 'select',
            options: unidades,
            optionLabel: 'nombre',
            optionValue: 'id',
            placeholder: 'Seleccione una unidad'
          },
          { name: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales', type: 'textarea' }
        ]}
      />
    </div>
  );
}