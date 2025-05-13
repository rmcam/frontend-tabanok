import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ContentItem, Category } from '@/components/dashboard/components/ContentManager'; // Importar tipos necesarios

interface UseFetchContentDataHook {
  contents: ContentItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void; // Función para recargar los datos
}

const useFetchContentData = (): UseFetchContentDataHook => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Verificar la estructura exacta de la respuesta de /content, /topics y /tags
      const [contentsData, categoriesData] = await Promise.all([
        api.get("/content"), // Usar endpoint /content (singular)
        api.get("/topics"), // Usar endpoint /topics (plural)
        api.get("/tags"), // Usar endpoint /tags (plural) // Aunque no se usa directamente aquí, se carga junto con los otros datos
      ]);
      setContents(contentsData); // Asumiendo que contentsData es un array de ContentItem
      setCategories(categoriesData); // Asumiendo que categoriesData es un array de Category (Topic)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar datos.";
      toast.error(`Error al cargar los datos: ${errorMessage}`);
      console.error("Error fetching data:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Ejecutar solo una vez al montar el componente

  const refetch = () => {
    fetchData();
  };

  return {
    contents,
    categories,
    loading,
    error,
    refetch,
  };
};

export default useFetchContentData;