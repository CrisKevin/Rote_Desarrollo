// src/components/ModalFormulario.jsx
export default function ModalFormulario({ 
  abierto, 
  editando, 
  formData, 
  onClose, 
  onSave, 
  onInputChange,
  error,
  titulo,          
  campos           
}) {
  if (!abierto) return null;

  // Determinar el título según si está editando o no
  const tituloModal = editando 
    ? (titulo?.editando || 'Editar') 
    : (titulo?.nuevo || 'Crear Nuevo');

  const getOptionLabel = (option, campo) => {
    if (typeof campo.optionLabel === 'function') {
      return campo.optionLabel(option);
    }
    return option[campo.optionLabel];
  };
  // Función para renderizar cada campo según su tipo
  const renderCampo = (campo) => {
    // Si es un select
    
    // Dentro de ModalFormulario.jsx, en renderCampo, para type='select':

if (campo.type === 'select') {
  return (
    <div className="relative">
      <select
        name={campo.name}
        value={formData[campo.name] || ''}
        onChange={onInputChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      >
        <option value="">{campo.placeholder || 'Seleccione...'}</option>
        {campo.options?.map((option) => (
          <option key={option[campo.optionValue]} value={option[campo.optionValue]}>
            {getOptionLabel(option, campo)}
          </option>
        ))} 
      </select>
      
      {/* Flecha personalizada */}
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

    // Si es un input normal
    return (
      <input
        type={campo.type || 'text'}
        name={campo.name}
        value={formData[campo.name] || ''}
        onChange={onInputChange}
        placeholder={campo.placeholder}
        autoComplete="off"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {tituloModal}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm">
              ❌ {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {campos.map((campo) => (
            <div key={campo.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {campo.label}
              </label>
              {renderCampo(campo)}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {editando ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}