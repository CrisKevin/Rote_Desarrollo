// src/components/ModalConfirmacion.jsx
export default function ModalConfirmacion({ 
  abierto, 
  titulo, 
  mensaje, 
  onConfirmar, 
  onCancelar 
}) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {titulo || 'Confirmar'}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {mensaje || '¿Estás seguro de realizar esta acción?'}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}