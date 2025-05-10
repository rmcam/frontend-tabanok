import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegación

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      {/* Contenido de la página principal de Configuración */}
      <p>Ajustes generales de la aplicación.</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Explorar:</h2>
        <ul>
          <li>
            <Link to="/settings/profile" className="text-blue-600 hover:underline">Perfil</Link>
          </li>
          {/* Otros enlaces relacionados con configuración */}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
