import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  GraduationCap,
  Tags,
  UserCircle,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Obtener el rol del usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role || 'ROLE_USER';
  const isROLE_ADMIN = userRole === 'ROLE_ADMIN';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      roles: ['ROLE_ADMIN', 'ROLE_USER'] // Todos pueden ver
    },
    {
      id: 'groups',
      label: 'Grupos',
      icon: Users,
      path: '/grupos',
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    },
    {
      id: 'teaching-position',
      label: 'Cargo de Docente',
      icon: GraduationCap,
      path: '/docente_cargo',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'tipo-cargo',
      label: 'Tipo de Cargo',
      icon: Tags, 
      path: '/tipo_cargo',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'tipo-docente',
      label: 'Tipo de Docente',
      icon: Tags, 
      path: '/tipo_docente',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'docente',
      label: 'Docentes',
      icon: UserCircle, 
      path: '/docentes',
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    },
    {
      id: 'tipo-unidad',
      label: 'Tipo de Unidad',
      icon: UserCircle, 
      path: '/tipo_unidad',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'unidad',
      label: 'Unidades',
      icon: UserCircle, 
      path: '/unidades',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'asignatura',
      label: 'Asignaturas',
      icon: UserCircle, 
      path: '/asignaturas',
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    },
    {
      id: 'gestion',
      label: 'Gestiones',
      icon: UserCircle, 
      path: '/gestiones',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'tipo-periodo',
      label: 'Tipo de Periodo',
      icon: UserCircle, 
      path: '/tipo_periodo',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'periodo',
      label: 'Periodos',
      icon: UserCircle, 
      path: '/periodos',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'asignatura-docente',
      label: 'Asignatura de Docentes',
      icon: UserCircle, 
      path: '/asignatura_docente',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
    {
      id: 'reportes',
      label: 'PDF',
      icon: FileText, 
      path: '/reporte',
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
      path: '/reportes',
      roles: ['ROLE_ADMIN', 'ROLE_USER']
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      path: '/configuracion',
      roles: ['ROLE_ADMIN'] // Solo ROLE_ADMIN
    },
  ];

  // Filtrar items según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-64'
        } md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              UATF
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isROLE_ADMIN ? 'ROLE_ADMINistrador' : 'Sistema Académico'}
            </p>
          </div>

          {/* Navigation menu CON SCROLL */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 sidebar-nav">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer info con usuario */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rol: {userRole === 'ROLE_ADMIN' ? 'ROLE_ADMINistrador' : 'Usuario'}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 UATF - Todos los derechos reservados
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}