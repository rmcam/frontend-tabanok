# Hooks Personalizados (`useAuth`, `useFetchUnits`)

---

Este documento describe los hooks personalizados clave utilizados en el frontend de Tabanok para gestionar el estado de autenticación y obtener datos de unidades.

## `useAuth`

Acceso al contexto de autenticación.

*   **Ubicación:** `frontend/src/auth/hooks/useAuth.ts`
*   **Descripción:** Proporciona acceso al estado de autenticación del usuario y a las funciones para interactuar con el sistema de autenticación (inicio de sesión, registro, cierre de sesión, recuperación de contraseña). Se basa en el `AuthContext` y el `AuthProvider`.
*   **Uso:**

```typescript
import { useAuth } from '@/auth/hooks/useAuth';

function MyComponent() {
  const { user, signin, signup, signout, forgotPassword, loading, signingIn, signingUp, requestingPasswordReset } = useAuth();
  // ...
}
```

*   **Retorno:**
    *   `user`: Objeto de usuario autenticado (`User | null`). Contiene información del usuario si está autenticado.
    *   `loading`: Booleano que indica si la verificación de autenticación inicial está en curso.
    *   `signingIn`: Booleano que indica si la operación de inicio de sesión está en curso.
    *   `signingUp`: Booleano que indica si la operación de registro está en curso.
    *   `requestingPasswordReset`: Booleano que indica si la operación de solicitud de restablecimiento de contraseña está en curso.
    *   `signin`: Función asíncrona para iniciar sesión. Recibe un objeto con `identifier` y `password`.
    *   `signup`: Función asíncrona para registrarse. Recibe un objeto con los datos del nuevo usuario.
    *   `signout`: Función asíncrona para cerrar sesión.
    *   `forgotPassword`: Función asíncrona para solicitar restablecimiento de contraseña. Recibe el email del usuario.

*   **Ejemplo:**

```typescript
import { useAuth } from '@/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await signout();
      navigate('/');
    } catch (error) {
      // Manejar error al cerrar sesión si es necesario
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Bienvenido, {user.email}!</p>
          <button onClick={handleSignout}>Cerrar sesión</button>
        </>
      ) : (
        <p>Por favor, inicia sesión.</p>
      )}
    </div>
  );
}
```

## `useFetchUnits`

Acceso a la lista de unidades del usuario autenticado con almacenamiento en caché.

*   **Ubicación:** `src/hooks/useFetchUnits.ts` (en el repositorio frontend)
*   **Descripción:** Hook personalizado para obtener la lista de unidades asociadas al usuario autenticado. Utiliza el hook `useAuth` para verificar la autenticación y obtener el ID del usuario. Implementa almacenamiento en caché utilizando `sessionStorage` para mejorar el rendimiento en cargas posteriores.
*   **Uso:**

```typescript
import useFetchUnits from '@/hooks/useFetchUnits';

function MyComponent() {
  const { units, loading, error } = useFetchUnits();
  // ...
}
```

*   **Retorno:**
    *   `units`: Array de unidades (`Unit[]`) o `null` si no se han cargado o hay un error.
    *   `loading`: Booleano que indica si la lista de unidades está cargando.
    *   `error`: Mensaje de error (`string | null`) si ocurre un problema durante la carga.

*   **Ejemplo:**

```typescript
import useFetchUnits from '@/hooks/useFetchUnits';

function MyComponent() {
  const { units, loading, error } = useFetchUnits();

  if (loading) {
    return <p>Cargando unidades...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!units || units.length === 0) {
    return <p>No hay unidades disponibles.</p>;
  }

  return (
    <ul>
      {units.map((unit) => (
        <li key={unit.id}>{unit.name}</li>
      ))}
    </ul>
  );
}
```

---

## `useGamificationData`

Acceso a los datos de gamificación del usuario autenticado.

*   **Ubicación:** `src/hooks/useGamificationData.ts` (en el repositorio frontend)
*   **Descripción:** Hook personalizado para obtener el resumen de gamificación, la lista de logros y los datos del leaderboard para el usuario autenticado. Este hook ha sido refactorizado para utilizar el hook `useFetchData` del proyecto para manejar la lógica de fetching, carga y manejo de errores.
*   **Uso:**

```typescript
import useGamificationData from '@/hooks/useGamificationData';

function MyComponent() {
  const { summary, achievements, leaderboard, loading, error } = useGamificationData();
  // ...
}
```

*   **Retorno:**
    *   `summary`: Resumen de gamificación (`GamificationSummary | null`).
    *   `achievements`: Array de logros (`Achievement[]`).
    *   `leaderboard`: Array de entradas del leaderboard (`LeaderboardEntry[]`).
    *   `loading`: Booleano que indica si los datos están cargando.
    *   `error`: Objeto de error (`Error | null`) si ocurre un problema durante la carga.

*   **Ejemplo:**

```typescript
import useGamificationData from '@/hooks/useGamificationData';
import Loading from '@/components/common/Loading';

function GamificationDashboard() {
  const { summary, achievements, leaderboard, loading, error } = useGamificationData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error al cargar los datos de gamificación: {error.message}</p>;
  }

  return (
    <div>
      <h1>Datos de Gamificación</h1>
      {summary && <p>Puntos totales: {summary.totalPoints}</p>}
      <h2>Logros</h2>
      <ul>
        {achievements.map(ach => (
          <li key={ach.id}>{ach.name} ({ach.unlocked ? 'Desbloqueado' : 'Bloqueado'})</li>
        ))}
      </ul>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map(entry => (
          <li key={entry.userId}>{entry.username}: {entry.totalPoints} puntos</li>
        ))}
      </ul>
    </div>
  );
}
```

---

Última actualización: 12/5/2025, 11:59 p. m. (America/Bogota, UTC-5:00)
