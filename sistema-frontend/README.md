# Dashboard Frontend - React + Vite + Tailwind

Un dashboard moderno, responsivo y funcional construido con **React**, **Vite**, **Tailwind CSS** y **Lucide React**. Incluye navegación completa, tema oscuro/claro y múltiples páginas.

## 🚀 Características Principales

- ✅ **Responsive Design** - Optimizado para mobile, tablet y desktop
- ✅ **Dark Mode** - Toggle fácil entre tema claro y oscuro
- ✅ **Sidebar Navegable** - Menú colapsable en móvil
- ✅ **Navbar Interactivo** - Dropdown de usuario con opciones
- ✅ **4 Páginas Funcionales**:
  - Dashboard - Métricas principales
  - Usuarios - Gestión y búsqueda
  - Reportes - Lista de reportes disponibles
  - Configuración - Panel de ajustes
- ✅ **Componentes Reutilizables** - Arquitectura limpia y escalable
- ✅ **Iconos Profesionales** - 40+ iconos de Lucide React
- ✅ **Sin TypeScript** - JavaScript puro (como se solicitó)

## 📦 Tecnologías

| Librería | Versión | Propósito |
|----------|---------|-----------|
| React | ^19.2.5 | Framework UI |
| Vite | ^8.0.10 | Build tool |
| Tailwind CSS | ^4.2.4 | Utility-first CSS |
| React Router DOM | ^7.14.2 | Enrutamiento |
| Lucide React | ^1.8.0 | Iconos SVG |
| PostCSS | ^8.5.10 | Procesamiento CSS |
| Autoprefixer | ^10.5.0 | Prefijos automáticos |

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Sidebar.jsx          # Barra lateral con navegación
│   ├── Navbar.jsx           # Barra superior con controles
│   └── DashboardCards.jsx   # Cards de métricas
├── layout/
│   └── DashboardLayout.jsx  # Layout principal
├── pages/
│   ├── Dashboard.jsx        # Página principal
│   ├── Users.jsx            # Gestión de usuarios
│   ├── Reports.jsx          # Vista de reportes
│   └── Settings.jsx         # Configuración
├── context/
│   └── ThemeContext.jsx     # Context de tema (dark/light)
├── App.jsx                  # Componente raíz
├── App.css                  # Estilos globales
├── index.css                # Directivas de Tailwind
└── main.jsx                 # Punto de entrada

public/                       # Archivos estáticos
package.json                  # Dependencias del proyecto
tailwind.config.js           # Configuración de Tailwind
postcss.config.js            # Configuración de PostCSS
vite.config.js               # Configuración de Vite
done.md                       # Registro de tareas completadas
```

## ⚙️ Instalación

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Pasos

1. **Clonar o acceder al proyecto**
```bash
cd sistema-frontend
```

2. **Instalar dependencias con Yarn**
```bash
yarn install
```

3. **Iniciar servidor de desarrollo**
```bash
yarn dev
```

El servidor estará disponible en: `http://localhost:5173/`

## 📖 Uso

### Comandos Disponibles

```bash
# Desarrollar
yarn dev

# Compilar para producción
yarn build

# Previsualizar build
yarn preview

# Linting
yarn lint
```

### Navegación

El dashboard incluye 4 secciones principales accesibles desde el menú:

- **Dashboard** - Panel principal con métricas
- **Usuarios** - Tabla de usuarios con búsqueda
- **Reportes** - Listado de reportes disponibles
- **Configuración** - Panel de ajustes del sistema

### Dark Mode

El toggle de modo oscuro está en la barra superior (icono de luna/sol). El estado se persiste en el DOM.

## 🎨 Personalización

### Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: "#aa3bff",      // Color principal
      "primary-light": "rgba(170, 59, 255, 0.1)",
      "primary-border": "rgba(170, 59, 255, 0.5)",
    },
  },
}
```

### Fuentes

Las fuentes están configuradas en `tailwind.config.js` y se pueden cambiar fácilmente.

### Componentes

Cada componente es independiente y se puede importar donde sea necesario:

```javascript
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
```

## 🧪 Componentes Disponibles

### Sidebar
- Navegación con iconos
- Estado activo dinámico
- Colapsable en móvil
- Dark mode integrado

### Navbar
- Toggle de tema oscuro/claro
- Dropdown de usuario
- Opciones funcionales
- Responsive

### DashboardCards
- Grid responsive (1-4 columnas)
- Iconos personalizados
- Colores distintos por métrica
- Hover effects

### DashboardLayout
- Wrapper para todas las páginas
- Integra Sidebar + Navbar
- Responsive container
- Área de contenido flexible

## 🌙 Tema Oscuro/Claro

El proyecto incluye dark mode configurado con Tailwind. La clase `dark` en el elemento `html` activa los estilos oscuros.

**Context**: Se utiliza `ThemeContext.jsx` para manejar el estado global del tema.

```javascript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { isDark, toggleDarkMode } = useTheme();
  // ...
}
```

## 📱 Responsiveness

El diseño es completamente responsivo usando Tailwind breakpoints:

- **Mobile**: < 640px (1 columna)
- **Tablet**: 640px - 1024px (2 columnas)
- **Desktop**: > 1024px (4 columnas)

## 🔧 Configuración de Tailwind

El archivo `tailwind.config.js` incluye:
- Extensiones de colores personalizados
- Fuentes del sistema
- Dark mode por clase
- Configuración de contenido

## 📝 Notas Importantes

- ✅ Proyecto preparado para producción básica
- ✅ Código limpio y bien comentado
- ✅ Siguiendo mejores prácticas de React
- ✅ Componentes reutilizables y mantenibles
- ⚠️ Las funcionalidades son placeholders (sin backend aún)

## 🚀 Próximas Mejoras

Para producción, considera agregar:

- [ ] Integración con API backend
- [ ] Validación de formularios (Formik, React Hook Form)
- [ ] Gráficas (Recharts, Chart.js)
- [ ] Notificaciones toast (React Toastify)
- [ ] Modales y diálogos
- [ ] Paginación en tablas
- [ ] Autenticación real
- [ ] Persistencia de estado (Redux, Zustand)

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

## 👨‍💻 Autor

Dashboard Admin - Sistema Frontend
**Creado**: 2025
**Stack**: React + Vite + Tailwind + Lucide

---

**Estado**: ✅ Completado y Funcional | Listo para personalizar
