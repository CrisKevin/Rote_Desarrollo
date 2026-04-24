import { Save, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    appName: 'Dashboard Admin',
    email: 'admin@dashboard.com',
    notifications: true,
    twoFactor: false,
    language: 'es',
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personaliza tu experiencia en la plataforma
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Configuración General
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Nombre de la Aplicación
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Idioma
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-primary"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="fr">Francés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Seguridad
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Notificaciones por Email
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recibe notificaciones sobre actividad importante
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactor}
              onChange={(e) => handleChange('twoFactor', e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Autenticación de Dos Factores
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Añade una capa extra de seguridad
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Cambios pendientes
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            Tienes cambios sin guardar. Guárdalos para que tengan efecto.
          </p>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
      >
        <Save className="w-5 h-5" />
        Guardar Cambios
      </button>
    </div>
  );
}
