import api from "@/lib/api";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useAuth } from "@/auth/hooks/useAuth"; // Importar useAuth para obtener el usuario
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

// TODO: Ajustar la interfaz Report según la estructura real de la respuesta del backend
interface Report {
  // La interfaz actual asume una lista de reportes con URL,
  // pero el endpoint del backend parece generar un solo reporte.
  // Podría ser necesario redefinir esto si el backend devuelve datos directos o una URL diferente.
  id: string; // Asumiendo que el reporte tiene un ID
  name: string; // Nombre del reporte
  url: string; // URL para acceder al reporte (si el backend la proporciona)
  description: string; // Descripción del reporte
  // Añadir otros campos si el backend devuelve datos directos del reporte
}

const ReportViewer = () => {
  const { user } = useAuth(); // Obtener el usuario actual
  // TODO: Ajustar el estado para manejar un solo reporte si el endpoint devuelve uno solo
  const [reportData, setReportData] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setError("No se pudo obtener el ID del usuario para cargar reportes.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Verificar la estructura exacta de la respuesta del endpoint /statistics/reports/quick/:userId
        // Este endpoint parece generar un reporte rápido para un usuario.
        // Podría devolver los datos del reporte directamente o una URL.
        const data: Report[] = await api.get(`/statistics/reports/quick/${user.id}`); // Usar endpoint del backend con userId
        // TODO: Ajustar cómo se manejan los datos recibidos.
        // Si el endpoint devuelve un solo objeto Report, ajustar setReportData([data]) o similar.
        setReportData(data); // Asumiendo temporalmente que devuelve un array compatible
        setError(null);
      } catch (error: unknown) {
        console.error("Error al obtener los reportes:", error);
        setError(
          "Error al obtener los reportes. Por favor, inténtelo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]); // Dependencia en user.id para recargar si cambia
  // TODO: Ajustar el renderizado si el endpoint devuelve un solo reporte en lugar de una lista
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <FaFileAlt
          size={24}
          className="mr-2"
          aria-label="Acceso a Reportes"
        />
        <h2 className="text-xl font-semibold">Acceso a Reportes</h2>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Skeleton className="h-8 w-[200px]" />
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {reportData.length > 0 ? (
        reportData.map((report) => ( // Esto asume que reportData sigue siendo un array
          <Card key={report.id} className="mb-4">
            <CardHeader>
              <CardTitle>{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{report.description}</p>
              {/* TODO: Ajustar la visualización de los datos del reporte según la estructura real */}
              {/* <pre className="bg-gray-100 p-2 rounded-md overflow-auto">
                <code>{JSON.stringify(report.data, null, 2)}</code>
              </pre> */}
            </CardContent>
          </Card>
        ))
      ) : (
        !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaFileAlt size={30} className="mb-3" />
            <p>No hay reportes disponibles.</p>
          </div>
        )
      )}
    </div>
  );
};

export default ReportViewer;
