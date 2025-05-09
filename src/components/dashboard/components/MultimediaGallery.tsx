import React, { useState } from "react";
import MultimediaPlayer from "../../common/MultimediaPlayer"; // Ajusta la ruta si es necesario
import useMultimedia from '@/hooks/useMultimedia'; // Import the hook

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
  const { multimedia: multimediaItems, loading, error } = useMultimedia(); // Use the hook with correct properties
  const [filterType, setFilterType] = useState<"video" | "audio" | "image" | "all">("all");

  const filteredMultimediaItems = filterType === "all"
    ? multimediaItems || [] // Handle potential undefined data
    : (multimediaItems || []).filter(item => item.type === filterType); // Handle potential undefined data

  return (
    <div className="multimedia-gallery">
      <h3>Galería Multimedia</h3>
      {/* ARIA live region for dynamic updates */}
      <div aria-live="polite" aria-atomic="true">
        {loading && <div>Cargando multimedia...</div>}
        {error && <div>Error: {error instanceof Error ? error.message : String(error)}</div>}
      </div>

      {!loading && !error && (
        <>
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
            {/* Refresh button removed temporarily */}
          </div>
          {filteredMultimediaItems.length === 0 ? (
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
        </>
      )}
    </div>
  );
};

export default MultimediaGallery;
