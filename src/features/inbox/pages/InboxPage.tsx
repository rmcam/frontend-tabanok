import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, Star, Calendar as CalendarIcon, Trash2, Eye, Lightbulb } from "lucide-react"; // Importar iconos

// Definir un tipo para los datos de la notificación
interface Notification {
  id: string;
  type: "message" | "achievement" | "event" | "system";
  title: string;
  description: string;
  date: string;
  read: boolean;
}

// Datos de notificaciones simulados para demostración
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Nuevo mensaje del profesor",
    description: "Tienes un nuevo mensaje de tu profesor sobre la lección de hoy.",
    date: "2025-05-27",
    read: false,
  },
  {
    id: "2",
    type: "achievement",
    title: "¡Logro desbloqueado!",
    description: "Has completado el módulo de Introducción al Kamentsa. ¡Felicidades!",
    date: "2025-05-26",
    read: false,
  },
  {
    id: "3",
    type: "event",
    title: "Recordatorio: Clase de conversación",
    description: "Tu clase de conversación de Kamentsa es mañana a las 10 AM.",
    date: "2025-05-25",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Actualización de la plataforma",
    description: "Se han añadido nuevas lecciones y ejercicios. ¡Explóralos!",
    date: "2025-05-24",
    read: true,
  },
];

const InboxPage: React.FC = () => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case "message":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "achievement":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "event":
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case "system":
        return <Lightbulb className="h-5 w-5 text-green-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    console.log(`Marcar notificación ${id} como leída`);
    // Lógica para actualizar el estado de la notificación (simulado)
  };

  const handleDelete = (id: string) => {
    console.log(`Eliminar notificación ${id}`);
    // Lógica para eliminar la notificación (simulado)
  };

  const handleViewDetails = (id: string) => {
    console.log(`Ver detalles de notificación ${id}`);
    // Lógica para mostrar los detalles completos de la notificación (ej. en un Dialog)
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Bandeja de Entrada</h1>

      <ScrollArea className="h-[calc(100vh-180px)] pr-4"> {/* Ajustar altura según el layout */}
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "bg-muted/50" : "bg-card"}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  {getIcon(notification.type)}
                  <CardTitle className="text-lg font-medium">
                    {notification.title}
                  </CardTitle>
                  {!notification.read && (
                    <Badge variant="default" className="ml-2">Nuevo</Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(notification.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </DropdownMenuItem>
                    {!notification.read && (
                      <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Marcar como Leída
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleDelete(notification.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {notification.description}
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  {notification.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default InboxPage;
