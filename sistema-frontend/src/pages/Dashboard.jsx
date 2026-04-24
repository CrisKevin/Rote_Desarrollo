import DashboardCards from '../components/DashboardCards';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al panel de control principal
        </p>
      </div>

      {/* Metrics Cards */}
      <DashboardCards />

      {/* Additional content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main chart area */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Gráfico de Ventas
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Área reservada para gráficos</p>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Nuevo usuario registrado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hace 2 horas
              </p>
            </div>
            <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Venta completada
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hace 4 horas
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Sistema actualizado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hace 1 día
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
