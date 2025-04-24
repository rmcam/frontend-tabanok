import React, { useEffect, useState } from 'react';
import MultimediaPlayer from '../../common/MultimediaPlayer'; // Ajusta la ruta si es necesario

interface MultimediaItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  lessonId: string;
  metadata: object;
}

const MultimediaGallery: React.FC = () => {
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        const cachedMultimedia = sessionStorage.getItem('multimediaItems');
        if (cachedMultimedia) {
          setMultimediaItems(JSON.parse(cachedMultimedia));
          setLoading(false);
          return;
        }
        const response = await fetch('/multimedia'); // Usar el endpoint GET /multimedia
        if (response.ok) {
          const data: MultimediaItem[] = await response.json();
          setMultimediaItems(data);
          sessionStorage.setItem('multimediaItems', JSON.stringify(data));
        } else {
          setError('Error al obtener la lista de multimedia.');
        }
      } catch (err) {
        setError('Error de red o del servidor al obtener multimedia: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchMultimedia();
  }, []);

  if (loading) {
    return <div>Cargando multimedia...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="multimedia-gallery">
      <h3>Galería Multimedia</h3>
      {multimediaItems.length === 0 ? (
        <p>No hay archivos multimedia disponibles.</p>
      ) : (
        <div
          className="gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {multimediaItems.map((item) => (
            <div key={item.id} className="gallery-item">
              <MultimediaPlayer type={item.type} url={item.url} title={item.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultimediaGallery;
