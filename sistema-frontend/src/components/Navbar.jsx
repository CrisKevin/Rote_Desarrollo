import { useState } from 'react';
import { ChevronDown, LogOut, Lock, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Obtener el usuario actual del localStorage
  const currentUser = authService.getCurrentUser();
  const userName = currentUser?.username || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    // Aquí puedes navegar a la página de cambio de contraseña
    // navigate('/cambiar-contrasena');
    console.log('Cambiar contraseña');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left side - Brand name for mobile, empty for desktop */}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bienvenido
          </h2>
        </div>

        {/* Right side - User dropdown */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userInitial}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                <button
                  onClick={handleChangePassword}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Cambiar contraseña
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4" />
                      Modo claro
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      Modo oscuro
                    </>
                  )}
                </button>
                <hr className="border-gray-200 dark:border-gray-800 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}