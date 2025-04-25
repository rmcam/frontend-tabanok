import React, { useEffect, useState } from "react";
import MultimediaPlayer from "../../common/MultimediaPlayer"; // Ajusta la ruta si es necesario
import api from '@/lib/api';

interface MultimediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  url: string;
  lessonId: string;
  metadata: object;
}

const MultimediaGallery: React.FC = () => {
  const [multimediaItems, setMultimediaItems] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"video" | "audio" | "image" | "all">("all");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        const cachedMultimedia = sessionStorage.getItem("multimediaItems");
        if (cachedMultimedia && !refresh) {
          setMultimediaItems(JSON.parse(cachedMultimedia));
          setLoading(false);
          return;
        }

        const data: MultimediaItem[] = await api.get('/multimedia');
        setMultimediaItems(data);
        sessionStorage.setItem("multimediaItems", JSON.stringify(data));
        setRefresh(false);
      } catch (err: unknown) {
        setError(
          "Error de red o del servidor al obtener multimedia: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMultimedia();
  }, [refresh]);

  const handleRefresh = () => {
    sessionStorage.removeItem("multimediaItems");
    setRefresh(true);
  };

  const filteredMultimediaItems = filterType === "all"
    ? multimediaItems
    : multimediaItems.filter(item => item.type === filterType);

  if (loading) {
    return <div>Cargando multimedia...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="multimedia-gallery">
      <h3>Galería Multimedia</h3>
      <div>
        <label htmlFor="filterType">Filtrar por tipo:</label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "video" | "audio" | "image" | "all")}
        >
          <option value="all">Todos</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Imagen</option>
        </select>
        <button onClick={handleRefresh}>Refrescar Galería</button>
      </div>
      {loading ? (
        <div>Cargando multimedia...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : filteredMultimediaItems.length === 0 ? (
        <p>No hay archivos multimedia disponibles.</p>
      ) : (
        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredMultimediaItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
            >
              <MultimediaPlayer
                type={item.type}
                url={item.url}
                title={item.title}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultimediaGallery;
