import { Sparkles, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 p-10 text-white shadow-lg">

        {/* Decoración */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute right-24 bottom-0 h-24 w-24 rounded-full bg-white/10"></div>

        <div className="relative z-10 flex items-start gap-5">
          <div className="rounded-full bg-white/20 p-4">
            <Sparkles className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              ¡Bienvenido!
            </h1>

            <p className="mt-3 max-w-2xl text-indigo-100 leading-relaxed">
              Nos alegra tenerte de vuelta. Desde el menú lateral podrás
              acceder a todas las funcionalidades del sistema para administrar
              la información de manera rápida, organizada y segura.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          ¿Qué puedes hacer desde el sistema?
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-indigo-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Administrar registros
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestiona toda la información disponible en los diferentes módulos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-indigo-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Consultar información
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Busca y visualiza los registros de forma rápida.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-indigo-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Mantener los datos actualizados
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agrega, modifica o elimina información cuando sea necesario.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-indigo-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Navegar entre módulos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Utiliza el menú lateral para acceder a cada sección del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}