import api from "@/lib/api";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";

interface Report {
  id: string;
  name: string;
  url: string;
  description: string;
}

const ReportViewer = () => {
  const [reportData, setReportData] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data: Report[] = await api.get("/reports");
        setReportData(data);
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
  }, []);

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
      <ul>
        {reportData.map((report) => (
          <li
            key={report.id}
            className="mb-2"
          >
            <a
              href={report.url}
              className="text-blue-500 hover:underline"
            >
              {report.name}
            </a>
            <p className="text-gray-700">{report.description}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Cargando reportes...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ReportViewer;
