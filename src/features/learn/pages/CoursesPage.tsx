import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Search } from "lucide-react"; // Importar iconos necesarios
import { useAllModules } from '@/hooks/modules/modules.hooks'; // Importar el hook para obtener módulos

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: modules, isLoading, error } = useAllModules(); // Usar el hook para obtener módulos

  const filteredModules = (modules || []).filter(module => {
    // Filtrar solo por término de búsqueda en nombre y descripción
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return <div className="p-4 sm:p-6 lg:p-8">Cargando cursos...</div>;
  }

  if (error) {
    return <div className="p-4 sm:p-6 lg:p-8 text-red-500">Error al cargar cursos: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Explorar Cursos</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Se eliminan los filtros de Nivel y Estado */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => ( // Usar module en lugar de course
            <Card key={module.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {module.name} {/* Usar module.name */}
                </CardTitle>
                {/* Asignar un icono basado en alguna propiedad del módulo si es posible */}
                <BookOpen className="h-6 w-6 text-muted-foreground" /> {/* Placeholder de icono */}
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm text-muted-foreground mb-2">
                  {module.description} {/* Usar module.description */}
                </CardDescription>
                {/* Ajustar la visualización de lecciones, nivel y estado según las propiedades de Module */}
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-1" /> {module.points} Puntos {/* Usar module.points como ejemplo */}
                </div>
                {/* Se eliminan las secciones de Nivel y Estado */}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  {/* Ajustar la URL para navegar al detalle del módulo */}
                  <Link to={`/learn/module/${module.id}`}>
                    Ver Módulo {/* Cambiar texto del botón */}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No se encontraron cursos que coincidan con los criterios.</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
