# Pendientes del Proyecto Tabanok

---

Este documento lista las tareas pendientes y los próximos pasos planificados para el proyecto Tabanok, tanto en el frontend como en el backend.

## Pendientes Clave

- **Diseño Responsive:**
  - Realizar una verificación exhaustiva del comportamiento responsive en diferentes dispositivos y tamaños de pantalla, utilizando herramientas de desarrollo del navegador o pruebas de interfaz de usuario automatizadas con control de viewport. (En progreso: Se han añadido clases de Tailwind para mejorar el diseño responsive de los componentes `MultimediaUploadForm.tsx` y `DashboardStatistics.tsx`).
- **Accesibilidad:**
  - Finalizar auditorías manuales de accesibilidad según WCAG 2.1.
  - Validar nuevamente la accesibilidad con herramientas automáticas y manuales después de implementar mejoras.
  - Mejorar la navegación por teclado en menús y diálogos si es necesario. (En progreso: Se ha verificado que los componentes de UI basados en Radix UI proporcionan una buena base para la navegación por teclado).
  - Asegurar que los formularios tengan etiquetas asociadas a cada campo y mensajes de error accesibles (`aria-invalid`, `aria-describedby`). (Completado: Se ha verificado que los componentes de formulario genéricos en `src/components/ui/Form.tsx` implementan estas prácticas).
  - Mejorar la lectura por lectores de pantalla añadiendo descripciones y roles adecuados. (En progreso: Se ha verificado que los componentes de UI basados en Radix UI y el uso de `sr-only` contribuyen a esto).
- **Testing:**
  - Mejorar la cobertura de tests en el frontend, especialmente en rutas protegidas y hooks personalizados. (Completado - Cobertura mejorada en hooks personalizados y rutas protegidas, incluyendo use-mobile, useCarousel, useFormValidation, useFetchData, useFetchUnits, useFetchStudentData, useSidebar, useSidebarCookie, useAuth, useAuthService y PrivateRoute). El hook `useGamificationData` ha sido refactorizado para utilizar `useFetchData`.
  - Mejorar la cobertura de tests en el backend. (Completado)
- **Despliegue:**
  - Automatizar despliegues a producción (el pipeline CI/CD ya construye y sube imágenes, falta activar el paso SSH). (Configurado con Docker Hub y GitHub Actions)
- **Planificación y Desarrollo de Nuevas Funcionalidades:**
  - Planificar nuevas funcionalidades y mejoras detalladas.
  - Prototipar la UI de los paneles (docente y estudiante) en Figma antes de codificar.
  - Diseñar e integrar la interfaz de usuario del Panel Docente con el backend. (Completado: La integración inicial de los componentes del dashboard con los endpoints del backend se ha completado).
  - Proteger las rutas del Panel Docente con el rol `teacher` o `admin`. (Completado)
  - Implementar la lógica para guardar los datos del formulario en el backend del Panel Docente. (Completado: La lógica en el frontend para enviar datos a los endpoints del backend se ha implementado).
  - Implementar la lógica para la gestión de categorías y etiquetas en el Panel Docente. (Completado: Los componentes `CategoryManager` y `TagManager` han sido modificados para usar los endpoints del backend).
  - Mejorar la interfaz de usuario del formulario en el Panel Docente. (Completado - mejoras de layout y estilos en ContentManager)
  - Implementar la lógica en el frontend para la subida y visualización de archivos multimedia. (Completado: Se ha implementado la validación del tipo de archivo en el componente `MultimediaUploadForm` y se han agregado filtros por tipo en el componente `MultimediaGallery`. Se ha implementado la previsualización del archivo seleccionado, la barra de progreso durante la subida y la selección de tipos de archivo permitidos, y la adición de metadatos al archivo).
  - Usar un componente `MultimediaPlayer` reutilizable en el frontend. (Completado: El componente `MultimediaPlayer` ya es reutilizable y se utiliza en `MultimediaGallery`).
  - Desarrollar la galería multimedia accesible en el frontend. (Completado: Se ha añadido una región ARIA live para mensajes de carga y error).
  - Escribir pruebas unitarias y de integración para las nuevas funcionalidades del Panel Docente. (En progreso: Se han añadido pruebas unitarias para `CategoryManager` y `TagManager`).
- Implementar la lógica para la gestión de contenidos, progreso de estudiantes, creación de actividades y acceso a reportes en el Panel Docente. (Completado: Se ha implementado las funcionalidades de crear, leer, actualizar y eliminar contenido en el componente `ContentManager`, utilizando la API definida en `src/lib/api.ts`. Se ha implementado la subida de múltiples archivos, la previsualización de archivos subidos y el editor de texto enriquecido).
- Implementar la interfaz de usuario para las páginas del sidebar (DashboardPage, InboxPage, CalendarPage, CoursesPage, LessonsPage, ProgressPage, ProfilePage, SecurityPage, SettingsPage). (Completado)
- Se agregó el componente `LatestActivities` para mostrar las últimas actividades realizadas por los estudiantes. (Completado: El componente ha sido integrado y modificado para usar el endpoint del backend).
- Se han añadido indicadores de carga a los componentes `ActivityCreator`, `StudentProgress` y `ReportViewer`. (Completado: Los indicadores de carga han sido añadidos).
- Se movió la verificación de la variable de entorno `VITE_API_URL` al componente `App.tsx` para que se realice solo una vez al inicio de la aplicación. (Completado: La verificación ha sido movida).
  - Implementar la funcionalidad de edición de contenido en el componente `ContentManager`. (Completado: Se ha implementado la funcionalidad de edición de contenido).
  - **Funcionalidades Incompletas Identificadas (Backend):**
    - **Module:** Se ha creado la estructura básica del módulo (`module.module.ts`), controlador (`module.controller.ts`), servicio (`module.service.ts`) y entidad (`entities/module.entity.ts`), y se ha registrado en `AppModule`. La lógica del servicio para interactuar con la base de datos está implementada. (Completado)
- **Validación Lingüística:**
  - Internacionalizar mensajes existentes en formularios y otros componentes del frontend. (Completado: Se añadió el archivo de traducción en español y se actualizó la configuración de i18next).
  - Integrar control ortográfico y gramatical en inputs de contenido textual.
  - Documentar reglas y filtros personalizados para validación semántica.
  - Validar calidad lingüística en contenido generado por usuarios.
- **Refactorización y Limpieza:**
  - Revisar y eliminar redundancias y campos obsoletos restantes en el código y la base de datos. (Se han abordado algunas redundancias en el módulo de autenticación).
  - Revisar redundancias y eliminar campos obsoletos restantes en el módulo de gamificación. (En progreso)
- Refactorizar los componentes en `src/components` para mejorar la organización y seguir las buenas prácticas (esto ya se ha iniciado según `EstadoProyecto.md`). Se ha corregido el manejo de errores en los componentes de gamificación (`AchievementsPage.tsx`, `GamificationPage.tsx`, `LeaderboardPage.tsx`).
- ~~Corregir errores de TypeScript en el módulo de recomendaciones~~
- **Módulo de Recomendaciones:**
  - ~~Corregir errores de TypeScript en `recommendations.service.ts` y `recommendations.controller.ts`~~
- **Componentes del Dashboard:**
  - Implementar la lógica para guardar la actividad en el componente `ActivityCreator`. (Completado: Se ha integrado la llamada a la API para guardar las actividades en el backend, utilizando la API definida en `src/lib/api.ts` y agregaciones para la longitud del título y caracteres especiales).
  - Implementar la lógica para mostrar el progreso de los estudiantes en el componente `StudentProgress`. (Completado: Se ha agregado una barra de progreso visual para representar el progreso de los estudiantes, utilizando la API definida en `src/lib/api.ts`). Se ha agregado un manejo de errores más robusto y se muestra un mensaje de error en caso de que la API no responda.
  - Implementar la lógica para mostrar los reportes en el componente `ReportViewer`. (Completado: Se ha agregado una descripción para cada reporte, utilizando la API definida en `src/lib/api.ts`). Se ha agregado un manejo de errores más robusto y se muestra un mensaje de error en caso de que la API no responda.
- Se agregó el componente `LatestActivities` para mostrar las últimas actividades realizadas por los estudiantes.
- Se han añadido indicadores de carga a los componentes `ActivityCreator`, `StudentProgress` y `ReportViewer`.
- Se movió la verificación de la variable de entorno `VITE_API_URL` al componente `App.tsx` para que se realice solo una vez al inicio de la aplicación. (Completado: La verificación ha sido movida).
  - Implementar la funcionalidad de edición de contenido en el componente `ContentManager`. (Completado: Se ha implementado la funcionalidad de edición de contenido).
    - **Siembra de Base de Datos:**
      - [x] Completar la siembra detallada para todas las entidades en los seeders individuales, utilizando los datos disponibles en los directorios `files/json/` y `files/sql/`. Se han implementado seeders para las entidades principales (`User`, `Account`, `Module`, `Unity`, `Lesson`, `Topic`, `Activity`, `Content`, `ContentVersion`, `Comment`, `Exercise`, `Progress`, `Vocabulary`, `Reward`, `Achievement`, `Badge`, `MissionTemplate`, `Season`, y `SpecialEvent`) a través de seeders individuales ejecutados mediante el comando `pnpm seed`. **Se ha completado la implementación básica de seeders para las entidades restantes: `RevokedToken`, `BaseAchievement`, `CollaborationReward`, `Gamification`, `Leaderboard`, `MentorSpecialization`, `Mentor`, `MentorshipRelation`, `Mission`, `Streak`, `UserAchievement`, `UserBadge`, `UserMission`, `UserReward`, `ContentValidation`, `Notification`, `Tag` (anteriormente `StatisticsTag`), `WebhookSubscription`, `Multimedia`, `UserLevel`, `CulturalAchievement` y `AchievementProgress`.** [x] Extender esta siembra para proporcionar datos más completos y realistas en todos los seeders.
      - [x] Investigar y resolver el error `EntityMetadataNotFoundError: No metadata for "Comment" was found.` al ejecutar `pnpm run seed`. Este error ha sido resuelto.

## Próximos pasos recomendados (Resumen)

1.  Finalizar auditorías manuales de accesibilidad y validar con herramientas.
2.  Mejorar cobertura de tests en frontend y backend.
3.  Automatizar despliegues a producción.
4.  Actualizar a Tailwind CSS v4: Implementar la actualización a Tailwind CSS v4 (versión `next`), incluyendo la revisión de la configuración de PostCSS y la adaptación de Shadcn UI.
5.  Mejorar el diseño y los colores: Integrar elementos visuales y una paleta de colores inspirada en la cultura Kamëntsá, incluyendo la ampliación de la paleta de colores en `tailwind.config.js`, la definición de variables CSS y la adaptación de componentes clave.
6.  Mejorar la página de inicio: Añadir secciones de noticias/blog, recursos adicionales y eventos a la página de inicio, y utilizar Playwright para crear pruebas automatizadas. (En progreso: Se ha reemplazado el Hero con la sección de "Presentación de la Cultura Kamëntsá")
7.  Refactorizar `ContentManager.tsx`: Refactorizar el componente `ContentManager.tsx` para mejorar su estructura, modularidad, legibilidad y mantenibilidad, incluyendo la refactorización de la lógica de estado y formulario, la extracción de la lógica de fetching inicial, la revisión y mejora de la validación, la división del renderizado complejo y el abordaje de los comentarios TODO.
4.  Planificar y desarrollar paneles docente/estudiante completos e integración multimedia en frontend.
5.  Internacionalizar mensajes e integrar validación lingüística avanzada.
6.  Mantener la documentación y la hoja de ruta actualizadas tras cada cambio relevante.

- **Diseño de la lista de unidades:** Mejorar el diseño de la lista de unidades (`UnitListPage.tsx`) utilizando componentes de la interfaz de usuario y ajustando la tipografía y el espaciado. Se ha agregado una sombra a las tarjetas y se ha aumentado el tamaño de las imágenes. (Completado)

---

Última actualización: 27/5/2025, 5:51 p. m. (America/Bogota, UTC-5:00)
