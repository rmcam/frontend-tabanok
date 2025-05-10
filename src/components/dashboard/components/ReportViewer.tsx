import api from "@/lib/api";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useAuth } from "@/auth/hooks/useAuth"; // Importar useAuth para obtener el usuario

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
  const [reportData, setReportData] = useState<Report[]>([]); // Podría cambiar a Report | null o la estructura real
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
      {/* TODO: Ajustar el renderizado para mostrar el reporte o un enlace si el backend devuelve una estructura diferente */}
      <ul>
        {reportData.map((report) => ( // Esto asume que reportData sigue siendo un array
          <li
            key={report.id}
            className="mb-2"
          >
            <a
              href={report.url} // Asumiendo que el objeto report tiene una URL
              className="text-blue-500 hover:underline"
              target="_blank" // Abrir en nueva pestaña
              rel="noopener noreferrer" // Seguridad para target="_blank"
            >
              {report.name} {/* Asumiendo que el objeto report tiene un nombre */}
            </a>
            <p className="text-gray-700">{report.description}</p> {/* Asumiendo que tiene descripción */}
          </li>
        ))}
      </ul>
      {isLoading && <p>Cargando reportes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {/* Si el backend devuelve un solo reporte, se podría renderizar aquí directamente */}
      {/* Ejemplo: {!isLoading && !error && reportData && <p>Contenido del reporte: {JSON.stringify(reportData)}</p>} */}
    </div>
  );
};

export default ReportViewer;
