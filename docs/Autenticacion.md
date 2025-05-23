# Flujo de Autenticación y Protección de Rutas en Tabanok

---

## Resumen

Este documento describe la implementación actual de la autenticación en Tabanok, integrando **React (Vite + TypeScript)** en el frontend y **NestJS** en el backend.

---

## Endpoints de Autenticación (Backend)

*   **Login:** `POST /auth/signin`
*   **Registro:** `POST /auth/signup`
*   **Cerrar sesión:** `POST /auth/signout`
*   **Solicitar restablecimiento de contraseña:** `POST /auth/forgot-password`
*   **Restablecer contraseña:** `POST /auth/reset-password`
*   **Verificar sesión:** `GET /auth/verify-session`
*   **Refrescar token:** `POST /auth/refresh-token`

---

## Payloads y Respuestas

### Login

**Request:**

```json
POST /auth/signin
{
  "identifier": "usuario_institucional_o_email",
  "password": "contraseña"
}
```

El campo `identifier` permite ingresar con el nombre de usuario o el correo electrónico.

**Response:**

Después de un inicio de sesión exitoso, el backend establece el `accessToken` y el `refreshToken` como cookies HttpOnly en la respuesta. No se retornan los tokens en el cuerpo de la respuesta por motivos de seguridad.

```json
{
  "message": "Login successful"
}
```

### Registro

**Descripción:** El formulario de registro en el frontend es un formulario de varios pasos con indicador de progreso y validación por pasos. Los campos se dividen en tres pasos:

*   Paso 1: Información de la cuenta (email, contraseña, usuario)
*   Paso 2: Información personal (nombre, segundo nombre, apellido, segundo apellido)
*   Paso 3: Confirmación de datos

La validación se ejecuta al interactuar con el campo (`onBlur`) y al intentar avanzar al siguiente paso. Los inputs muestran feedback visual de error (borde rojo).

**Request:**

```json
POST /auth/signup
{
  "username": "usuario",
  "firstName": "Nombre",
  "secondName": "SegundoNombre (Opcional)",
  "firstLastName": "Apellido",
  "secondLastName": "SegundoApellido (Opcional)",
  "email": "correo@ejemplo.com",
  "password": "contraseña"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "uuid",
    "username": "usuario",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "email": "correo@ejemplo.com",
    "roles": [ "user" ],
    "status": "active",
    "languages": [],
    "preferences": {
      "notifications": true,
      "language": "es",
      "theme": "light"
    },
    "level": 1,
    "culturalPoints": 0,
    "gameStats": {
      "totalPoints": 0,
      "level": 1,
      "streak": 0,
      "lastActivity": "2025-04-18T20:03:24.979Z"
    },
    "resetPasswordToken": null,
    "resetPasswordExpires": null,
    "lastLoginAt": null,
    "isEmailVerified": false,
    "createdAt": "2025-04-18T20:03:24.982Z",
    "updatedAt": "2025-04-18T20:03:24.982Z"
  }
}
```

**Nota:** La estructura del objeto `user` devuelto en la respuesta de registro y verificación de sesión ha sido ampliada para incluir campos de perfil adicionales como `languages`, `preferences` (con `notifications`, `language`, `theme`) y `profile` (con `bio`, `location`, `interests`, `community`). La definición del tipo `User` en `src/auth/types/authTypes.ts` ha sido actualizada para reflejar esta estructura.

Se ha ajustado el seeder de usuarios (`UserSeeder`) para utilizar el enum `UserRole` definido en `src/auth/enums/auth.enum.ts` y se ha corregido la importación de `UserStatus`. El rol 'mentor' en el seeder ahora utiliza `UserRole.TEACHER` para ser compatible con el enum de roles de la base de datos.

### Restablecer contraseña

**Request:**

```json
POST /auth/reset-password
{
  "token": "token_de_restablecimiento",
  "newPassword": "nueva_contraseña"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Contraseña restablecida exitosamente"
}
```

### Solicitar restablecimiento de contraseña

**Request:**

```json
POST /auth/password/reset/request
{
  "email": "correo@ejemplo.com"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Correo electrónico de restablecimiento de contraseña enviado"
}
```

### Cierre de Sesión

**Request:**

```json
POST /auth/signout
```

**Response:**

```json
{
  "message": "Sesión cerrada exitosamente"
}
```

### Verificar Sesión

**Request:**

```json
GET /auth/verify-session
```

**Response:**

Si la sesión es válida, el backend devuelve los datos del usuario autenticado.

```json
{
  "id": "uuid",
  "username": "usuario",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "email": "correo@ejemplo.com",
  "roles": [ "user" ],
  "status": "active",
  // ... otras propiedades del usuario
}
```

Si la sesión no es válida o el token ha expirado, el backend devuelve un error 401 (No autorizado).

### Refrescar Token

**Request:**

```json
POST /auth/refresh-token
```

La solicitud se envía con la cookie HttpOnly del refresh token.

**Response:**

Si el refresh token es válido, el backend establece nuevas cookies HttpOnly de access y refresh token y devuelve un mensaje de éxito.

```json
{
  "message": "Token refreshed successfully"
}
```

Si el refresh token no es válido o ha expirado, el backend devuelve un error 401 (No autorizado).

---

## Flujo de Autenticación

1.  El usuario se registra enviando los campos requeridos al endpoint `/auth/signup`.
2.  Después de un registro exitoso, el frontend realiza automáticamente un inicio de sesión con las credenciales proporcionadas (`/auth/signin`) para asegurar que las cookies HttpOnly se establezcan correctamente.
3.  El usuario inicia sesión enviando `identifier` (nombre de usuario o email) y `password` a `/auth/signin`.
4.  El backend establece el `accessToken` y el `refreshToken` como cookies HttpOnly en la respuesta.
5.  El frontend ya no almacena los tokens en `localStorage` ni `sessionStorage`, ya que se gestionan automáticamente a través de las cookies HttpOnly por el navegador.
6.  Para verificar la sesión inicial o después de acciones de autenticación (login/signup), el frontend llama al endpoint `/auth/verify-session`.
7.  El backend, al recibir la solicitud de verificación de sesión, lee automáticamente el `accessToken` de la cookie HttpOnly.
8.  El backend valida el token y, si es válido, devuelve los datos del usuario autenticado.
9.  El frontend utiliza los datos del usuario recibidos para actualizar el estado de autenticación en la aplicación (`AuthContext`).
10. Para acceder a rutas protegidas, las solicitudes subsiguientes enviadas desde el frontend al backend incluirán automáticamente las cookies HttpOnly.
11. El `JwtAuthGuard` en el backend lee automáticamente el `accessToken` de la cookie `accessToken` para validar y autorizar el acceso a las rutas protegidas.
12. Si el token ha expirado o no es válido, el backend devuelve un error 401 (No autorizado). El frontend intercepta este error y redirige al usuario a la página de inicio de sesión.
13. La renovación de tokens se espera que sea manejada automáticamente por el backend utilizando la cookie HttpOnly del refresh token en el endpoint `/auth/refresh-token`, sin intervención directa del frontend para leer o guardar los tokens.
14. Para cerrar sesión, el frontend llama al endpoint `/auth/signout`. El backend elimina las cookies HttpOnly de autenticación.

---

## Protección de rutas sensibles

### Frontend

*   El frontend utiliza el componente `PrivateRoute` (`src/components/common/PrivateRoute.tsx`) para proteger rutas sensibles.
*   Si el usuario no está autenticado (determinado por el estado del `AuthContext`), se muestra un loader mientras se verifica el estado; si no está autenticado tras la verificación, se redirige automáticamente a la página de inicio (`/`).
*   Si la ruta requiere un rol específico (por ejemplo, `admin`), y el usuario no lo tiene, se redirige a `/unauthorized`.
*   Tras iniciar sesión correctamente, el usuario es redirigido automáticamente a `/dashboard`.
*   El componente `PrivateRoute` acepta una prop `requiredRoles` (un array de strings) para especificar qué roles tienen permiso para acceder a la ruta.
*   Las rutas protegidas actualmente son:
    *   `/dashboard` (requiere roles: 'user', 'student')
    *   `/teacher-dashboard` (redirige a `/dashboard`)
    *   `/multimedia` (requiere roles: 'user', 'student', 'teacher')
    *   `/units` (requiere roles: 'user', 'student', 'teacher')
    *   `/activities` (requiere roles: 'user', 'student', 'teacher')
    *   `/gamification` (requiere roles: 'user', 'student', 'teacher')
    *   `/settings` (requiere roles: 'user', 'student', 'teacher')
    *   `/` (requiere autenticación para acceder al contenido principal, pero la ruta en sí es pública para mostrar la página de inicio con opciones de login/signup)
*   Ejemplo de uso en `App.tsx`:

    ```tsx
    <Route
      path="/dashboard"
      element={
        <PrivateRoute requiredRoles={['user', 'student']}> {/* Ejemplo con roles */}
          <AuthenticatedLayout> {/* Usar el layout autenticado */}
            <Suspense fallback={<div>Cargando contenido...</div>}>
              <UnifiedDashboard />
            </Suspense>
          </AuthenticatedLayout>
        </PrivateRoute>
      }
    />
    ```

### Backend

*   El backend utiliza guards (`JwtAuthGuard` y `RolesGuard`) aplicados globalmente para proteger las rutas.
*   `JwtAuthGuard` verifica la validez del token JWT leyendo el `accessToken` de la cookie `accessToken`. Las rutas marcadas con `@Public()` son excluidas.
*   `RolesGuard` verifica si el usuario tiene el rol necesario (`@Roles()`).
*   Si el usuario no está autenticado, no tiene permisos, o el token ha expirado, se deniega el acceso con 401 (No autorizado) o 403 (Prohibido).

#### Manejo de Tokens Expirados

*   El frontend intercepta el error 401 (por ejemplo, en el servicio de autenticación o un interceptor global) y redirige al usuario a la página de inicio de sesión (`/`).

#### Manejo de Tokens Expirados

*   El backend verifica la fecha de expiración del token JWT. Si ha expirado, devuelve 401.
*   El frontend intercepta el error 401 (por ejemplo, en el servicio de autenticación o un interceptor global) y redirige al usuario a la página de inicio de sesión (`/`).

Para manejar los errores de autenticación, se modificó el archivo `src/lib/api.ts` para lanzar un evento "unauthorized" cuando se recibe un error 401. Se agregó un `useEffect` a `src/App.tsx` para escuchar el evento "unauthorized" y redirigir al usuario a la página de inicio de sesión.

#### Manejo de Rutas Públicas Específicas (`/lesson/featured`)

Se implementó una solución en el backend para asegurar que el endpoint `GET /lesson/featured` sea accesible públicamente a pesar de las guardias globales, reordenando las rutas en `LessonController` y añadiendo una verificación explícita en `JwtAuthGuard`.

---

## Estructura del Frontend de Autenticación

*   `src/auth/services/authService.ts`: Funciones para llamadas a la API de autenticación (Login, Signup, Generate Reset Token, Verify Session, Signout, Refresh Token). No espera tokens en el cuerpo de la respuesta y utiliza `credentials: 'include'` para cookies HttpOnly. Manejo de errores mejorado con mensajes condicionales (producción/desarrollo) y tipado correcto.
*   `src/auth/hooks/useAuthService.ts`: Hook que encapsula la lógica de `authService.ts`.
*   `src/auth/utils/authUtils.ts`: Utilidades relacionadas con autenticación. Funciones de manejo de tokens (`saveToken`, `getToken`, `removeToken`) son no-op ya que el frontend no gestiona directamente las cookies HttpOnly.
*   `src/auth/context/authContext.ts`: Define y exporta el Contexto de Autenticación (`AuthContext`).
*   `src/auth/context/authProvider.tsx`: Define y exporta el Proveedor de Autenticación (`AuthProvider`). Centraliza el estado del usuario y estados de carga individuales. Realiza verificación de sesión inicial y después de login/signup. Integra notificaciones con `sonner`. **Manejo de errores mejorado para mostrar mensajes más amigables, incluyendo el parseo de respuestas JSON del backend para extraer el campo `message`.**
*   `src/auth/hooks/useAuth.ts`: Hook simple para consumir `AuthContext`.
*   `src/auth/components/`: Componentes de formularios de autenticación (`SigninForm.tsx`, `SignupForm.tsx`, `ForgotPasswordForm.tsx`). Implementan validación y feedback visual de error. Utilizan `useAuth` para operaciones y navegación. `SignupForm` refactorizado para simplificar lógica de validación por pasos. **La validación en `SigninForm.tsx` para el campo `identifier` ha sido actualizada para permitir correos electrónicos válidos, el nombre de usuario 'admin', y nombres de usuario con 6 o más caracteres.**
*   `src/components/common/FormWrapper.tsx`: Componente para envolver formularios con estilos visuales.
*   `src/components/common/Modal.tsx`: Componente genérico de modal.
*   `src/components/common/AuthModals.tsx`: Agrupa los modales de autenticación.
*   `src/components/common/PrivateRoute.tsx`: Componente para proteger rutas, verifica autenticación y roles.
*   `src/components/layout/AuthenticatedLayout.tsx`: Layout para rutas autenticadas.
*   `src/App.tsx`: Define rutas principales, usa `PrivateRoute` y `AuthenticatedLayout`. Espera carga inicial de autenticación.

---

## Manejo de Mensajes de Éxito y Error

La aplicación utiliza la librería `sonner` para mostrar notificaciones (toasts) de éxito y error al usuario.

*   El componente `<Toaster />` se ha añadido en `src/main.tsx` para permitir la visualización de estos toasts.
*   La función `showToast` en `src/auth/context/authProvider.tsx` es responsable de mostrar los mensajes. En caso de errores, intenta parsear el mensaje como JSON y mostrar el valor del campo `message` si está presente, o el mensaje completo si no es un JSON válido o no contiene el campo `message`.
*   Las funciones de autenticación (`signup`, `signin`, `forgotPassword`, `resetPassword`, `signout`) en `src/auth/context/authProvider.tsx` ahora incluyen bloques `try...catch` para capturar errores de las llamadas a la API (propagados desde `useAuthService` y `authService`) y llamar a `showToast` con el mensaje de error correspondiente.

---

## Pendientes y recomendaciones

*   Documentar el flujo de validación de email.
*   Mantener ejemplos de payloads y respuestas actualizados.
*   Asegurar la congruencia de la tipografía en los formularios con la paleta de estilos general del proyecto.
*   Asegurar que la propiedad `role` se incluya correctamente en el payload del token JWT devuelto por el backend (en el endpoint de verificación de sesión).
*   Asegurar que `VITE_API_URL` use HTTPS en producción.
*   Implementar la validación de la firma del token JWT en el backend.
*   Confirmar la lógica de usar el email como username por defecto en el registro con los requisitos del backend.
*   Unificar el manejo de errores (retornar booleanos vs. lanzar errores) en el `AuthContext`.
*   Los tests unitarios para `auth.service.spec.ts` han sido corregidos y ahora pasan. Se han añadido pruebas para el guard `JwtAuthGuard` y ahora prioriza el token del header sobre el de las cookies.

---

Última actualización: 7/5/2025, 12:33 a. m. (America/Bogota, UTC-5:00)
