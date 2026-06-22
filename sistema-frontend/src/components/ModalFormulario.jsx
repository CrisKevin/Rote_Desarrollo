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
  campos,
  columns = 1  // Nueva prop: 1, 2 o 3 columnas
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

  // Determinar ancho máximo según columnas
  const maxWidthClass = {
    1: 'max-w-md',      // Angosto como antes
    2: 'max-w-4xl',     // Ancho para 2 columnas
    3: 'max-w-6xl'      // Más ancho para 3 columnas
  };

  // Determinar clases de grid según número de columnas
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  // Función para renderizar cada campo según su tipo
  const renderCampo = (campo) => {
    // Para campos select
    if (campo.type === 'select') {
      return (
        <div className="relative">
          <select
            name={campo.name}
            value={formData[campo.name] || ''}
            onChange={onInputChange}
            disabled={campo.disabled}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

    // Para campos textarea
    if (campo.type === 'textarea') {
      return (
        <textarea
          name={campo.name}
          value={formData[campo.name] || ''}
          onChange={onInputChange}
          placeholder={campo.placeholder}
          rows={campo.rows || 3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      );
    }

    // Determinar las clases para inputs numéricos (sin flechas)
    const numericClass = campo.numeric ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : "";

    // Para inputs normales
    return (
      <input
        type={campo.numeric ? 'number' : (campo.type || 'text')}
        name={campo.name}
        value={formData[campo.name] || ''}
        onChange={(e) => {
          let value = e.target.value;
          
          // Si el campo debe estar en mayúsculas
          if (campo.uppercase) {
            value = value.toUpperCase();
          }
          
          // Crear un nuevo evento con el valor transformado
          const newEvent = {
            target: {
              name: campo.name,
              value: value
            }
          };
          
          onInputChange(newEvent);
        }}
        placeholder={campo.placeholder}
        autoComplete="off"
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${numericClass}`}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-900 rounded-lg w-full ${maxWidthClass[columns]} max-h-[90vh] flex flex-col shadow-xl`}>
        {/* Header - Fijo */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {tituloModal}
          </h2>
        </div>
        
        {/* Error - Fijo */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={`grid ${gridClasses[columns]} gap-4`}>
            {campos.map((campo) => (
              <div 
                key={campo.name} 
                className={campo.type === 'textarea' && columns > 1 ? 'md:col-span-2' : ''}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {campo.label}
                  {campo.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderCampo(campo)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer con botones - Fijo */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition-colors"
          >
            {editando ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}