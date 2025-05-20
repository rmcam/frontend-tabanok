import React, { useState } from "react";
import MultimediaPlayer from "../../common/MultimediaPlayer"; // Ajusta la ruta si es necesario
import useMultimedia from '@/hooks/useMultimedia'; // Import the hook
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import {
  Card,
  CardContent,
} from "@/components/ui/card"; // Import Card components
import { FaFileAlt } from "react-icons/fa"; // Import FaFileAlt

const MultimediaGallery: React.FC = () => {
  const { multimedia: multimediaItems, loading, error } = useMultimedia(); // Use the hook with correct properties
  const [filterType, setFilterType] = useState<"video" | "audio" | "image" | "all">("all");

  const filteredMultimediaItems = filterType === "all"
    ? multimediaItems || [] // Handle potential undefined data
    : (multimediaItems || []).filter(item => item.type === filterType); // Handle potential undefined data

  return (
    <div className="flex flex-col">
      <h3>Galería Multimedia</h3>
      {/* ARIA live region for dynamic updates */}
      <div aria-live="polite" aria-atomic="true">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-8 w-[200px]" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error instanceof Error ? error.message : String(error)}</AlertDescription>
          </Alert>
        )}
      </div>

      {!loading && !error && (
        <>
          <div className="mb-4">
            <label htmlFor="filterType" className="mr-2">Filtrar por tipo:</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "video" | "audio" | "image" | "all")}
              className="border rounded px-2 py-1"
            >
              <option value="all">Todos</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Imagen</option>
            </select>
            {/* Refresh button removed temporarily */}
          </div>
          {filteredMultimediaItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <FaFileAlt size={30} className="mb-3" />
              <p>No hay archivos multimedia disponibles.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredMultimediaItems.map((item) => (
                <Card key={item.id} className="shadow-sm">
                  <CardContent className="p-2">
                    <MultimediaPlayer
                      type={item.type as "video" | "audio" | "image"}
                      url={item.url}
                      title={item.title}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MultimediaGallery;
