import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChevronDown, PlayCircle, FileText, HelpCircle, Volume2, Lock, Unlock } from "lucide-react"; // Iconos para tipos de contenido y bloqueo
import { cn } from "@/lib/utils";

// Definir tipos para Unidad y Lección
interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "audio";
  progress: number; // 0-100
  url: string;
  isLocked: boolean;
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Datos simulados de unidades y lecciones
const mockUnits: Unit[] = [
  {
    id: "u1",
    title: "Unidad 1: Saludos y Presentaciones",
    lessons: [
      { id: "l1", title: "Lección 1.1: Vocabulario Básico", type: "text", progress: 100, url: "/learn/lesson/l1", isLocked: false },
      { id: "l2", title: "Lección 1.2: Pronunciación", type: "audio", progress: 70, url: "/learn/lesson/l2", isLocked: false },
      { id: "l3", title: "Lección 1.3: Diálogos Cotidianos", type: "video", progress: 0, url: "/learn/lesson/l3", isLocked: false },
      { id: "l4", title: "Cuestionario Unidad 1", type: "quiz", progress: 0, url: "/learn/lesson/l4", isLocked: true }, // Bloqueada
    ],
  },
  {
    id: "u2",
    title: "Unidad 2: La Familia y el Hogar",
    lessons: [
      { id: "l5", title: "Lección 2.1: Miembros de la Familia", type: "text", progress: 0, url: "/learn/lesson/l5", isLocked: true },
      { id: "l6", title: "Lección 2.2: Objetos del Hogar", type: "video", progress: 0, url: "/learn/lesson/l6", isLocked: true },
    ],
  },
];

const LessonsPage: React.FC = () => {
  const [openUnits, setOpenUnits] = useState<string[]>([]);

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case "video": return <PlayCircle className="h-4 w-4" />;
      case "text": return <FileText className="h-4 w-4" />;
      case "quiz": return <HelpCircle className="h-4 w-4" />;
      case "audio": return <Volume2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Lecciones del Curso</h1>
      {/* Aquí se podría añadir el título del curso actual si se pasa como prop */}

      <div className="space-y-4">
        {mockUnits.map((unit) => (
          <Card key={unit.id} className="overflow-hidden">
            <Collapsible
              open={openUnits.includes(unit.id)}
              onOpenChange={() => toggleUnit(unit.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer py-4 px-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <CardTitle className="text-xl font-semibold">
                    {unit.title}
                  </CardTitle>
                  <ChevronDown className={cn("h-5 w-5 transition-transform", openUnits.includes(unit.id) && "rotate-180")} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4">
                <div className="space-y-3 mt-4">
                  {unit.lessons.map((lesson) => (
                    <Card key={lesson.id} className={cn(
                      "flex items-center p-4 border",
                      lesson.isLocked ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : "hover:bg-accent/50 transition-colors"
                    )}>
                      <div className="flex items-center gap-3 flex-grow">
                        {lesson.isLocked ? <Lock className="h-5 w-5 text-gray-400" /> : getLessonIcon(lesson.type)}
                        <div className="flex-grow">
                          <h3 className="font-medium text-base">{lesson.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Progress value={lesson.progress} className="h-1.5 w-24 mr-2" />
                            <span>{lesson.progress}%</span>
                            {lesson.progress === 100 && (
                              <Badge variant="secondary" className="ml-2">Completada</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button asChild disabled={lesson.isLocked} variant="outline">
                        <Link to={lesson.url}>
                          {lesson.isLocked ? "Bloqueada" : (lesson.progress > 0 && lesson.progress < 100 ? "Continuar" : "Iniciar")}
                        </Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
