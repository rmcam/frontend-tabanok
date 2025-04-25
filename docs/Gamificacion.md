# Módulo de Gamificación - Proyecto Tabanok (Backend)

---

Este documento describe el módulo de gamificación implementado en el backend de Tabanok, sus flujos de negocio, mejoras recientes, relación con los usuarios y el estado de sus pruebas y documentación.

**Actualizado abril 2025**

---

## Flujos de negocio implementados

El módulo de gamificación abarca varios flujos de negocio para incentivar la participación y el aprendizaje:

*   Logros culturales (`CulturalAchievementService`).
*   Recompensas por colaboración (`CollaborationRewardService`).
*   Mentoría (`MentorService`).
*   Misiones (`MissionService`).
*   Eventos especiales (`SpecialEventService`).

---

## Mejoras recientes

*   Refactorización de `StatisticsReportService`.
*   Resolución de dependencia circular entre `AuthModule` y `GamificationModule` utilizando `forwardRef()`.
*   Optimización del flujo de "Obtención de estadísticas de colaboración" en `CollaborationRewardService` mediante la implementación de un sistema de caché.

---

## Relación entre Usuarios y Estadísticas

Cada usuario en la plataforma tiene una entrada asociada en la tabla `statistics` para registrar su progreso y logros en el sistema de gamificación.

---

## Pruebas Unitarias

El módulo de gamificación cuenta con pruebas unitarias para verificar el correcto funcionamiento de sus servicios principales.

### Servicios con pruebas unitarias existentes

*   `GamificationService`
*   `LeaderboardService`
*   `MissionService`
*   `CulturalAchievementService`
*   `CollaborationRewardService`
*   `MentorService`

---

## Pendientes

*   **Cobertura de Pruebas:** Revisar y ampliar la cobertura completa de las pruebas unitarias para asegurar que todos los casos de uso y métodos de los servicios de gamificación estén cubiertos.
*   **Rendimiento:** Monitorizar el rendimiento de los flujos de negocio de gamificación en entornos de carga real y realizar optimizaciones adicionales si es necesario.
*   **Documentación API:** Documentar completamente las API del módulo de gamificación utilizando Swagger para facilitar su uso por parte del frontend y otros servicios.

---

Ver lista completa de pendientes del proyecto en [`docs/Pendientes.md`](./Pendientes.md).

---

Última actualización: 24/4/2025, 8:53 p. m. (America/Bogota, UTC-5:00)
