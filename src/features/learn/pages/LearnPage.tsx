import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button'; // Asumiendo que tienes un componente Button de Shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Asumiendo que tienes componentes Card de Shadcn/ui

const LearnPage: React.FC = () => {
  const { t } = useTranslation();

  // Array de emojis para simular iconos Kamentsá
  const kamentsaIcons = ['🎨', '🎶', '🌿', '🏺', '🎭', '🦅', '🌈', '✨', '📖', '🗣️'];

  return (
    <div className="flex flex-col md:flex-row flex-grow p-4 md:p-8">
      {/* Sección Central Scrolleable */}
      <div className="flex-1 overflow-y-auto pr-0 md:pr-4">
        <h1 className="text-3xl font-bold mb-4">{t("welcome")}</h1>
        <p className="mb-4">Esta es la página de aprendizaje. Aquí encontrarás una gran cantidad de recursos para mejorar tus habilidades.</p>
        
        {/* Contenido de ejemplo para la sección scrolleable con iconos en camino */}
        <div className="flex flex-col items-center py-8 relative w-full">
          {/* Línea del camino */}
          <div className="absolute left-1/2 md:left-[calc(50%-1px)] transform -translate-x-1/2 h-full w-1 bg-gray-700 rounded-full z-0 top-0 bottom-0"></div>
          
          {/* NOTA: Estos son marcadores de posición. Aquí se integrarían iconos SVG o componentes de iconos reales de la cultura Kamentsá. */}
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              {/* Nodo de Unidad Principal */}
              <div className={`relative z-10 flex items-center w-full my-4 
                ${i % 2 === 0 ? 'justify-start md:justify-start' : 'justify-start md:justify-end'}`}>
                <div className="flex-shrink-0 flex items-center justify-center p-4 border rounded-full shadow-lg bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer w-24 h-24">
                  <span className="text-5xl">{kamentsaIcons[i % kamentsaIcons.length]}</span>
                </div>
                <div className={`p-2 text-left ${i % 2 === 0 ? 'ml-4' : 'ml-4 md:mr-4 md:text-right'}`}>
                  <p className="font-medium text-lg">Unidad {i + 1}</p>
                  <p className="text-sm text-muted-foreground">Aprende sobre la cultura Kamentsá.</p>
                </div>
              </div>

              {/* Actividad Secundaria (Test o Misión) */}
              {i < 9 && ( // No añadir actividad después de la última unidad
                <div className={`relative z-10 flex items-center w-full my-2 
                  ${i % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start md:justify-start'}`}>
                  <div className={`flex-shrink-0 flex items-center justify-center p-2 border rounded-full shadow-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer w-16 h-16 
                    ${i % 2 === 0 ? 'order-1 ml-0 md:order-2 md:ml-4' : 'order-1 mr-0 md:mr-4'}`}>
                    <span className="text-3xl">{i % 3 === 0 ? '📝' : '🎮'}</span> {/* Alternar entre test y misión */}
                  </div>
                  <div className={`p-1 text-sm 
                    ${i % 2 === 0 ? 'order-2 text-left md:text-right' : 'order-2 text-left'}`}>
                    <p className="font-medium">Actividad {i % 3 === 0 ? 'de Test' : 'Adicional'}</p>
                    <p className="text-xs text-muted-foreground">Pon a prueba tus conocimientos.</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sección Derecha de Invitación */}
      <div className="w-full md:w-1/4 lg:w-1/5 pt-4 md:pt-0 md:pl-4 flex-shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>¡Únete a la Comunidad!</CardTitle>
            <CardDescription>Crea un perfil para guardar tu progreso, acceder a contenido exclusivo y conectar con otros estudiantes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button className="w-full">Iniciar Sesión</Button>
            <Button variant="outline" className="w-full">Crear Perfil</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnPage;
