import { Download, Filter } from 'lucide-react';

export default function Reports() {
  const reports = [
    {
      id: 1,
      name: 'Reporte de Ventas Mensuales',
      date: '2025-04-01',
      type: 'Ventas',
      status: 'Completado',
    },
    {
      id: 2,
      name: 'Análisis de Usuarios Activos',
      date: '2025-03-28',
      type: 'Usuarios',
      status: 'Completado',
    },
    {
      id: 3,
      name: 'Reporte de Ingresos Trimestral',
      date: '2025-03-20',
      type: 'Finanzas',
      status: 'Pendiente',
    },
    {
      id: 4,
      name: 'Análisis de Comportamiento',
      date: '2025-03-15',
      type: 'Análisis',
      status: 'Completado',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reportes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accede a todos los reportes disponibles
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
          <Filter className="w-5 h-5" />
          Filtrar
        </button>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {report.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {report.date}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                <Download className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {report.type}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === 'Completado'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}
              >
                {report.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Historial de Reportes
        </h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Reporte generado
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hace {i + 1} horas
                </p>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
