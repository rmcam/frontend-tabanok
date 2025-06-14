## Arquitectura del Frontend

El frontend de Tabanok es una aplicación web construida con **React (Vite + TypeScript)**. Sigue una estructura modular para organizar los componentes, hooks, servicios y utilidades.

### Componente HomePage

El componente `HomePage` (`src/components/home/HomePage.tsx`) es la página principal de la plataforma. Ha sido refactorizado y mejorado para incluir las siguientes secciones y características:

*   **Sección de "Presentación de la Cultura Kamëntsá":** Incluye un título llamativo, una descripción atractiva, testimonios destacados y enlaces a recursos clave.
*   **Sección de Características:** Destaca las funcionalidades principales como Lecciones Interactivas, Gamificación y Seguimiento de Progreso, utilizando componentes reutilizables (`FeatureCard`).
*   **Sección de Lecciones Destacadas:** Muestra lecciones obtenidas dinámicamente desde la API del backend, con manejo de estado de carga y error. Cada lección se presenta utilizando el componente `FeaturedLessonCard`.
*   **Sección de Testimonios:** Presenta testimonios de usuarios en un carrusel con funcionalidad de autoplay y controles de pausa/reproducción.
*   **Sección de Preguntas Frecuentes:** Incluye un componente FAQ (`FAQ`).
*   **Sección de Contacto:** Contiene un formulario de contacto (`ContactForm`).
*   **Footer:** Pie de página con enlaces de navegación.
*   **Integración de Modales de Autenticación:** Los modales de inicio de sesión, registro y recuperación de contraseña se integran y controlan desde `HomePage`.
*   **Barra de Navegación Estática:** Una barra de navegación (`HomeNavbar`) visible al cargar y fija al desplazarse, con opciones de autenticación.

### Estructura de Componentes y Páginas

El frontend de Tabanok organiza sus componentes y páginas de la siguiente manera:

*   **`src/components/`**: Contiene componentes reutilizables y específicos de UI.
    *   `common/`: Componentes reutilizables en toda la aplicación (ej. `PrivateRoute`, `AuthModals`, `Loading`, `mode-toggle`).
    *   `layout/`: Componentes de layout (ej. `app-sidebar`, `navbar`, `RootLayout`).
    *   `ui/`: Componentes base de Shadcn UI y componentes personalizados basados en ellos (ej. `Button`, `Card`, `Input`, `Select`, `Progress`, `Switch`, `Dialog`, `Calendar`, `Accordion`, `Collapsible`, `Table`, `Avatar`, `Badge`, `Separator`, `Tooltip`, `DropdownMenu`, `ScrollArea`).
        *   `sidebar.tsx`: Componente principal de la Sidebar.
        *   `mobile-sidebar.tsx`: Componente específico para la Sidebar en vista móvil.
        *   `sidebar.constants.ts`: Constantes relacionadas con la Sidebar.

*   **`src/features/`**: Contiene las páginas y componentes específicos de cada módulo o característica de la aplicación.
    *   `auth/`: Componentes y servicios relacionados con la autenticación (ej. `AuthModal`, `ForgotPasswordForm`, `RegisterForm`, `ResetPasswordForm`).
    *   `landing/`: Componentes y páginas de la página de inicio (ej. `LandingPage`, `HeroSection`, `FeaturesSection`, `AboutSection`, `CallToActionSection`).
    *   `dashboard/`: Contiene la `DashboardPage` y sus componentes específicos.
        *   `pages/DashboardPage.tsx`: Implementada con un resumen de cursos recientes/en progreso, utilizando tarjetas con iconos y barras de progreso.
    *   `inbox/`: Contiene la `InboxPage` y sus componentes específicos.
        *   `pages/InboxPage.tsx`: Implementada con un listado de notificaciones en formato de tarjeta, con iconos y acciones.
    *   `calendar/`: Contiene la `CalendarPage` y sus componentes específicos.
        *   `pages/CalendarPage.tsx`: Implementada con un calendario gregoriano que muestra eventos importantes directamente en las celdas y un diálogo para detalles.
    *   `learn/`: Contiene las páginas relacionadas con el aprendizaje.
        *   `pages/LearnPage.tsx`: Página principal del módulo de aprendizaje.
        *   `pages/CoursesPage.tsx`: Implementada con una cuadrícula de tarjetas de cursos, incluyendo búsqueda y filtros, y mostrando información detallada como número de lecciones y nivel.
        *   `pages/LessonsPage.tsx`: Implementada con organización por unidades/temas usando componentes colapsables, y tarjetas de lección con tipo de contenido, progreso y estado de bloqueo.
        *   `pages/ProgressPage.tsx`: Implementada con métricas clave, progreso por curso y una galería de logros/insignias.
    *   `settings/`: Contiene las páginas de configuración.
        *   `pages/ProfilePage.tsx`: Implementada con información de perfil editable, previsualización de avatar y separación de opciones de seguridad.
        *   `pages/SecurityPage.tsx`: Implementada con secciones para cambiar contraseña y configurar autenticación de dos factores (2FA).
        *   `pages/SettingsPage.tsx`: Implementada con ajustes generales (idioma, tema) y preferencias de notificaciones.
    *   `dashboard/` (Panel Docente): Componentes específicos del dashboard unificado (`UnifiedDashboard`) y sus subcomponentes (ej. `ActivityCreator`, `StudentProgress`, `ReportViewer`, `MultimediaUploadForm`, `MultimediaGallery`, `ContentManager`, `LatestActivities`, **`RoleManager`**). Todos estos componentes de sección se cargan de forma lazy. **Todos estos componentes ahora consumen los endpoints del backend correspondientes para obtener y enviar datos.**
        *   `ActivityCreator`: Permite crear actividades y guardarlas en el backend (`POST /activities`). Se ha agregado validación para la longitud del título y caracteres especiales.
        *   `StudentProgress`: Muestra el progreso de los estudiantes utilizando una barra de progreso visual, obteniendo datos del backend (`GET /analytics/studentProgress`). Se ha agregado un manejo de errores más robusto y se muestra un mensaje de error en caso de que la API no responda.
        *   `ReportViewer`: Muestra reportes, obteniendo datos del backend (`GET /statistics/reports/quick/:userId`). Se ha agregado un manejo de errores más robusto y se muestra un mensaje de error en caso de que la API no responda.
        *   `MultimediaUploadForm`: Permite subir archivos multimedia al backend (`POST /multimedia/upload`) con validación del tipo de archivo. Se ha implementado la previsualización del archivo seleccionado, la barra de progreso durante la subida y la selección de tipos de archivo permitidos, y la adición de metadatos al archivo.
        *   `MultimediaGallery`: Muestra una galería de archivos multimedia con filtros por tipo, obteniendo datos a través del hook `useMultimedia` que llama a `/multimedia`.
        *   `ContentManager`: Permite crear (`POST /content`), leer (`GET /content`), actualizar (`PUT /content/:id`) y eliminar (`DELETE /content/:id`) contenido en el backend. Se ha implementado la subida de múltiples archivos, la previsualización de archivos subidos, la eliminación de archivos subidos y el editor de texto enriquecido. Además, se ha implementado la funcionalidad de edición de contenido.
        *   `CategoryManager`: Modificado para usar el endpoint `/topics` para la gestión de categorías (listar, crear, actualizar, eliminar).
        *   `TagManager`: Modificado para la gestión de etiquetas (listar, crear, actualizar, eliminar).
        *   **`RoleManager`:** Se ha añadido un componente para la gestión de roles de usuario, utilizando un nuevo servicio `userService.ts` para obtener usuarios (`GET /users`) y actualizar sus roles (`PATCH /users/{id}/roles`) con TanStack Query.
    *   Se agregó el componente `LatestActivities` para mostrar las últimas actividades realizadas por los estudiantes, obteniendo datos del backend (`GET /activities`) y filtrando los resultados en el frontend.
    *   Se han añadido indicadores de carga a los componentes del dashboard.
    *   `gamification/`: Componentes específicos del módulo de gamificación (ej. `GamificationPage`, `LeaderboardPage`, `AchievementsPage`). Se ha corregido el manejo de errores en estos componentes para mostrar correctamente los mensajes de error.
    *   `units/`: Componentes específicos del módulo de unidades (ej. `UnitDetail`, `UnitListPage`, `UnitCard`).

### Hooks Personalizados

Se utilizan hooks personalizados como `useAuth` (`src/auth/hooks/useAuth.ts`), `useUnits` (`src/hooks/useFetchUnits.ts`) y `useGamificationData` (`src/hooks/useGamificationData.ts`) para gestionar el estado y obtener datos, incluyendo almacenamiento en caché con `sessionStorage` para unidades y multimedia. El hook `useGamificationData` ha sido refactorizado para utilizar el hook `useFetchData` del proyecto.

*   `useSidebar.ts`: Hook para acceder al contexto de la Sidebar.
*   `useSidebarCookie.ts`: Hook para gestionar la persistencia del estado de la Sidebar en cookies.

### Gestión de Rutas

Las rutas de la aplicación se gestionan utilizando **React Router DOM**. Se emplea el componente `PrivateRoute` (`src/components/common/PrivateRoute.tsx`) para proteger las rutas sensibles, verificando la autenticación del usuario y los roles requeridos.

### Estado de Autenticación

El estado de autenticación se maneja globalmente utilizando un **Contexto de React (`AuthContext`)** y un **Proveedor (`AuthProvider`)** (`src/auth/context/`). La lógica de interacción con la API de autenticación y el manejo de cookies HttpOnly reside en `src/auth/services/authService.ts`. Se utilizan hooks personalizados (`src/auth/hooks/useAuth.ts`) para acceder al contexto de autenticación.

### Estilos

Los estilos se implementan utilizando **Tailwind CSS** con una configuración personalizada (`tailwind.config.js`) que incluye una paleta de colores inspirada en la cultura Kamëntsá. Se utilizan componentes de **shadcn/ui** para una interfaz consistente y accesible. Recientemente, se han realizado ajustes en los componentes de UI básicos (`Button`, `Table`, `Input`, `Textarea`, `Badge`) para mejorar la consistencia en el uso de colores, espaciado y tipografía, alineándolos con la paleta y las clases de utilidad definidas en `tailwind.config.js`.

### Internacionalización

La aplicación está configurada para internacionalización con `react-i18next`. La configuración inicial se encuentra en `src/i18n.ts`, donde se cargan los archivos de traducción y se establecen las opciones. Se ha iniciado la traducción de mensajes en los formularios de autenticación, aunque la traducción completa está pendiente y se han encontrado problemas de formato/parsing durante el proceso.

### Validación Lingüística

Se utilizan validaciones básicas con **Zod** en formularios. La integración avanzada con APIs como LanguageTool para control ortográfico y gramatical está en progreso.

### Hooks Personalizados

Se utilizan hooks personalizados como `useAuth` (`src/auth/hooks/useAuth.ts`) para gestionar el estado de autenticación y `useUnits` (`src/hooks/useFetchUnits.ts`) para obtener datos de unidades, incluyendo almacenamiento en caché con `sessionStorage`.

### Diseño Responsive

El frontend implementa diseño responsive utilizando **Tailwind CSS** con clases de utilidad para controlar el layout, tamaño y visibilidad de los elementos en diferentes puntos de quiebre (`sm:`, `md:`, `lg:`, etc.). Se utilizan **CSS Grid** y **Flexbox** para crear layouts flexibles y adaptables, como en el Dashboard y los componentes de UI. Componentes de UI genéricos como `Card`, `Dialog`, `Sheet` y `Table` están diseñados con responsive en mente, incluyendo el uso de **container queries** en las tarjetas y `overflow-x-auto` para tablas. La barra lateral tiene una implementación específica para móviles (`MobileSidebar`) que se espera que se muestre como un panel deslizable en pantallas pequeñas, controlada por un trigger.

Se han realizado ajustes específicos para mejorar la responsividad en:
*   **Lista de Unidades:** Se ha mejorado el diseño de la lista de unidades (`UnitListPage.tsx`) utilizando componentes de la interfaz de usuario y ajustando la tipografía y el espaciado. Se ha agregado una sombra a las tarjetas y se ha aumentado el tamaño de las imágenes. Se han añadido media queries al archivo `src/index.css` para adaptar el diseño a diferentes tamaños de pantalla, apilando las tarjetas en pantallas pequeñas y reduciendo los márgenes y el tamaño de la fuente.

El frontend implementa diseño responsive utilizando **Tailwind CSS** con clases de utilidad para controlar el layout, tamaño y visibilidad de los elementos en diferentes puntos de quiebre (`sm:`, `md:`, `lg:`, etc.). Se utilizan **CSS Grid** y **Flexbox** para crear layouts flexibles y adaptables, como en el Dashboard y los componentes de UI. Componentes de UI genéricos como `Card`, `Dialog`, `Sheet` y `Table` están diseñados con responsive en mente, incluyendo el uso de **container queries** en las tarjetas y `overflow-x-auto` para tablas. La barra lateral tiene una implementación específica para móviles (`MobileSidebar`) que se espera que se muestre como un panel deslizable en pantallas pequeñas, controlada por un trigger.

Se han realizado ajustes específicos para mejorar la responsividad en:
*   **HomePage:** Se ajustó el espaciado vertical de las secciones y el padding horizontal del contenedor principal. Se modificó el espaciado vertical de los enlaces del pie de página y la visibilidad de los bordes en las FeatureCards para diferentes tamaños de pantalla.
*   **Dashboard:** Se ajustó el padding horizontal del contenedor principal. Se mejoró la visualización de las pestañas (`TabsList`) en pantallas pequeñas reduciendo el tamaño del texto y ajustando el espaciado entre pestañas para mitigar el desbordamiento.

### Integración con Backend

El frontend consume la API RESTful proporcionada por el backend para obtener datos (como lecciones destacadas y unidades) y realizar operaciones de autenticación.

---

Última actualización: 27/5/2025, 5:51 p. m. (America/Bogota, UTC-5:00)
