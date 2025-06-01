import React from 'react';
import type { LearningContent, LearningTextContent, LearningVideoContent, LearningQuizContent, LearningImageContent } from '@/types/learning';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactPlayer from 'react-player/youtube';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import type { LearningContentRendererProps } from '@/types/learning'; // Importar LearningContentRendererProps
import LearningQuiz from './LearningQuiz'; // Nueva importación
import { Lock } from 'lucide-react'; // Importar Lock para usarlo como componente

const LearningContentRenderer: React.FC<LearningContentRendererProps> = ({ content, isLocked }) => {
  // Helper para renderizar multimedia
  const renderMultimedia = (multimedia: LearningContent['multimedia']) => {
    if (!multimedia || multimedia.length === 0) {
      return null;
    }

    return (
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Multimedia Asociada:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {multimedia.map((item) => (
            <Card key={item.id} className="shadow-sm">
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{item.fileName}</p>
                <p className="text-xs text-muted-foreground">Tipo: {item.fileType} ({item.mimeType})</p>
                {/* Renderizado básico de multimedia por tipo */}
                {item.fileType === 'image' && item.filePath && (
                  <img src={item.filePath} alt={item.fileName} className="mt-2 max-h-40 w-auto object-contain" />
                )}
                {item.fileType === 'video' && item.filePath && (
                   <AspectRatio ratio={16 / 9} className="mt-2">
                     <video controls src={item.filePath} className="w-full h-full object-cover"></video>
                   </AspectRatio>
                )}
                 {item.fileType === 'audio' && item.filePath && (
                   <audio controls src={item.filePath} className="mt-2 w-full"></audio>
                 )}
                {/* TODO: Añadir más tipos de multimedia si es necesario */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("shadow-sm", {
      "border-l-4 border-blue-500": content.type === 'text' || content.type === 'html',
      "border-l-4 border-red-500": content.type === 'video' || content.type === 'youtube',
      "border-l-4 border-green-500": content.type === 'quiz',
      "border-l-4 border-yellow-500": content.type === 'image',
      "border-l-4 border-gray-500": !['text', 'html', 'video', 'youtube', 'quiz', 'image'].includes(content.type),
      "opacity-50 cursor-not-allowed": isLocked, // Aplicar estilos de bloqueo
    })}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{content.title}</CardTitle>
        {content.description && <p className="text-muted-foreground text-sm">{content.description}</p>}
      </CardHeader>
      <CardContent>
        {isLocked && (
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md mb-4">
            <Lock className="h-12 w-12 text-gray-500" />
            <p className="ml-4 text-lg text-gray-600">Contenido Bloqueado</p>
          </div>
        )}
        {/* Renderizado de contenido basado en el tipo */}
        {!isLocked && content.type === 'text' && (content as LearningTextContent).content && (
          <div className="prose max-w-none">
            <p>{(content as LearningTextContent).content}</p>
          </div>
        )}

        {!isLocked && content.type === 'html' && (content as LearningTextContent).content && (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: (content as LearningTextContent).content }} />
        )}

        {!isLocked && content.type === 'video' && (content as LearningVideoContent).content?.url && (
           <AspectRatio ratio={16 / 9}>
             <video controls src={(content as LearningVideoContent).content.url} className="w-full h-full object-cover"></video>
           </AspectRatio>
        )}

        {!isLocked && content.type === 'youtube' && (content as LearningVideoContent).content?.url && (
           <AspectRatio ratio={16 / 9}>
             <ReactPlayer url={(content as LearningVideoContent).content.url} controls width="100%" height="100%" />
           </AspectRatio>
        )}

        {!isLocked && content.type === 'image' && (content as LearningImageContent).content?.url && (
           <img src={(content as LearningImageContent).content.url} alt={content.title} className="max-h-96 w-auto object-contain" />
        )}

        {content.type === 'quiz' && (content as LearningQuizContent).content && (
          <LearningQuiz
            quiz={(content as LearningQuizContent).content}
            onComplete={(isCorrect) => {
              // Lógica para registrar el progreso del quiz ya está en LearningQuiz
              console.log(`Quiz completado. ¿Correcto?: ${isCorrect}`);
            }}
          />
        )}

        {/* Mensaje para tipos desconocidos */}
        {!isLocked && !['text', 'html', 'video', 'youtube', 'image', 'quiz'].includes(content.type) && (
           <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-mono text-sm text-gray-700">
              Tipo de Contenido Desconocido: {content.type}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Renderizado de contenido para tipo '{content.type}' pendiente.
            </p>
          </div>
        )}

        {/* Renderizar multimedia asociada */}
        {renderMultimedia(content.multimedia)}

      </CardContent>
    </Card>
  );
};

export default LearningContentRenderer;
