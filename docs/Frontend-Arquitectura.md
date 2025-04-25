## Arquitectura del Frontend

El frontend de Tabanok es una aplicación web construida con **React (Vite + TypeScript)**. Sigue una estructura modular para organizar los componentes, hooks, servicios y utilidades.

### Componente HomePage

El componente `HomePage` (`src/components/home/HomePage.tsx`) es la página principal de la plataforma. Ha sido refactorizado y mejorado para incluir las siguientes secciones y características:

*   **Sección Hero:** Incluye título, descripción, una imagen de fondo con efecto parallax y superposición de color, y botones interactivos. Los datos para esta sección se gestionan centralmente en `src/components/home/heroCards.ts`.
*   **Sección de Características:** Destaca las funcionalidades principales como Lecciones Interactivas, Gamificación y Seguimiento de Progreso, utilizando componentes reutilizables (`FeatureCard`).
*   **Sección de Lecciones Destacadas:** Muestra lecciones obtenidas dinámicamente desde la API del backend, con manejo de estado de carga y error. Cada lección se presenta utilizando el componente `FeaturedLessonCard`.
*   **Sección de Testimonios:** Presenta testimonios de usuarios en un carrusel con funcionalidad de autoplay y controles de pausa/reproducción.
*   **Sección de Preguntas Frecuentes:** Incluye un componente FAQ (`FAQ`).
*   **Sección de Contacto:** Contiene un formulario de contacto (`ContactForm`).
*   **Footer:** Pie de página con enlaces de navegación.
*   **Integración de Modales de Autenticación:** Los modales de inicio de sesión, registro y recuperación de contraseña se integran y controlan desde `HomePage`.
*   **Barra de Navegación Estática:** Una barra de navegación (`HomeNavbar`) visible al cargar y fija al desplazarse, con opciones de autenticación.

### Estructura de Componentes

Los componentes del frontend se organizan en el directorio `src/components/` con la siguiente estructura:

*   `common/`: Componentes reutilizables en toda la aplicación (ej. `PrivateRoute`, `AuthModals`, `Loading`).
*   `dashboard/`: Componentes específicos del dashboard unificado (`UnifiedDashboard`) y sus subcomponentes (ej. `ActivityCreator`, `StudentProgress`, `ReportViewer`, `MultimediaUploadForm`, `MultimediaGallery`, `ContentManager`, `LatestActivities`). Estos componentes ahora tienen implementada la lógica para interactuar con la API del backend y mejorar la experiencia del usuario, incluyendo validaciones, uso de variables de entorno y la API definida en `src/lib/api.ts`.
*   `general/`: Componentes generales no específicos de una sección particular.
*   `home/`: Componentes utilizados en la página de inicio (`HomePage`) y sus subcomponentes (ej. `HeroSection`, `FeaturedLessonCard`, `ContactForm`, `FAQ`, `HomeNavbar`).
*   `layout/`: Componentes de layout (ej. `AuthenticatedLayout`).
*   `navigation/`: Componentes de navegación (ej. Sidebar).
*   `ui/`: Componentes base de Shadcn UI y componentes personalizados basados en ellos (ej. `Button`, `Carousel`, `Sidebar`).

### Gestión de Rutas

Las rutas de la aplicación se gestionan utilizando **React Router DOM**. Se emplea el componente `PrivateRoute` (`src/components/common/PrivateRoute.tsx`) para proteger las rutas sensibles, verificando la autenticación del usuario y los roles requeridos.

### Estado de Autenticación

El estado de autenticación se maneja globalmente utilizando un **Contexto de React (`AuthContext`)** y un **Proveedor (`AuthProvider`)** (`src/auth/context/`). La lógica de interacción con la API de autenticación y el manejo de cookies HttpOnly reside en `src/auth/services/authService.ts`. Se utilizan hooks personalizados (`src/auth/hooks/useAuth.ts`) para acceder al contexto de autenticación.

### Estilos

Los estilos se implementan utilizando **Tailwind CSS** con una configuración personalizada (`tailwind.config.js`) que incluye una paleta de colores inspirada en la cultura Kamëntsá. Se utilizan componentes de **shadcn/ui** para una interfaz consistente y accesible.

### Internacionalización

La aplicación está configurada para internacionalización con `react-i18next`, aunque la traducción de mensajes existentes en formularios está pendiente.

### Validación Lingüística

Se utilizan validaciones básicas con **Zod** en formularios. La integración avanzada con APIs como LanguageTool para control ortográfico y gramatical está en progreso.

### Hooks Personalizados

Se utilizan hooks personalizados como `useAuth` (`src/auth/hooks/useAuth.ts`) para gestionar el estado de autenticación y `useUnits` (`src/hooks/useFetchUnits.ts`) para obtener datos de unidades, incluyendo almacenamiento en caché con `sessionStorage`.

### Integración con Backend

El frontend consume la API RESTful proporcionada por el backend para obtener datos (como lecciones destacadas y unidades) y realizar operaciones de autenticación.

---

Última actualización: 24/4/2025, 8:50 p. m. (America/Bogota, UTC-5:00)
