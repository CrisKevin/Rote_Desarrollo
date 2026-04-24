// src/pages/Products.jsx
export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos los productos del sistema
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
          Nuevo Producto
        </button>
      </div>

      {/* Aquí va el contenido de tu página */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Contenido de la página de productos...
        </p>
      </div>
    </div>
  );
}