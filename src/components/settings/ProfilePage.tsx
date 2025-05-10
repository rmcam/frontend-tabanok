import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import Loading from '@/components/common/Loading';
import * as authService from '@/auth/services/authService'; // Importar authService

const ProfilePage: React.FC = () => {
  const { user, loading, refetchUser } = useAuth(); // Obtener refetchUser del hook
  const [profileData, setProfileData] = useState({ firstName: '', secondName: '', firstLastName: '', secondLastName: '', email: '', username: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        secondName: user.secondName || '',
        firstLastName: user.firstLastName || '',
        secondLastName: user.secondLastName || '',
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <div>No se pudo cargar la información del usuario.</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Llamar al servicio para actualizar el perfil
      await authService.updateProfile(profileData);
      setSuccessMessage('Perfil actualizado exitosamente.');
      refetchUser(); // Refrescar los datos del usuario en el contexto de autenticación
    } catch (err: unknown) { // Cambiado de any a unknown
      if (err instanceof Error) {
         setError(err.message);
      } else {
         setError('Error al actualizar el perfil.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Administración de Perfil</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">Primer Nombre:</label>
          <input type="text" id="firstName" value={profileData.firstName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
         <div className="mb-4">
          <label htmlFor="secondName" className="block text-gray-700 font-bold mb-2">Segundo Nombre:</label>
          <input type="text" id="secondName" value={profileData.secondName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="firstLastName" className="block text-gray-700 font-bold mb-2">Primer Apellido:</label>
          <input type="text" id="firstLastName" value={profileData.firstLastName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
         <div className="mb-4">
          <label htmlFor="secondLastName" className="block text-gray-700 font-bold mb-2">Segundo Apellido:</label>
          <input type="text" id="secondLastName" value={profileData.secondLastName} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Nombre de Usuario:</label>
          <input type="text" id="username" value={profileData.username} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Correo Electrónico:</label>
          <input type="email" id="email" value={profileData.email} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        {/* Otros campos del perfil aquí */}
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
