import React, { useEffect, useState } from 'react';
import * as multimediaService from '@/services/multimediaService'; // Importar el servicio de multimedia
import { MultimediaItem } from '@/types/multimediaTypes'; // Importar el tipo MultimediaItem
import Loading from '@/components/common/Loading'; // Importar componente de carga
import MultimediaPlayer from '@/components/common/MultimediaPlayer'; // Importar MultimediaPlayer

const MultimediaPage: React.FC = () => {
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMultimediaItems = async () => {
      try {
        const data = await multimediaService.getMultimediaItems();
        setMultimediaItems(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar el contenido multimedia.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMultimediaItems();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Galería de Multimedia</h1>
      {multimediaItems.length === 0 ? (
        <p>No hay contenido multimedia disponible en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {multimediaItems.map(item => (
            <div key={item.id} className="border rounded shadow overflow-hidden">
              {item.type === 'image' && (
                <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
              )}
              {(item.type === 'video' || item.type === 'audio') &&
                 <MultimediaPlayer url={item.url} type={item.type} />
              }
              <div className="p-4">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">Tipo: {item.type}</p>
                {/* Aquí podrías agregar un enlace o botón para ver/reproducir el item */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultimediaPage;
