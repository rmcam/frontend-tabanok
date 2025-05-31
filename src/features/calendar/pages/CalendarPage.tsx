import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from 'date-fns/locale'; // Importar el locale español

// Definir un tipo para los datos del evento
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  type: "course" | "task" | "live_class" | "other";
}

// Datos de eventos simulados para demostración
const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Inicio Curso Kamentsa",
    date: new Date(2025, 5, 1), // Junio 1, 2025
    description: "Comienzo del curso de Introducción al Kamentsa.",
    type: "course",
  },
  {
    id: "e2",
    title: "Entrega Tarea 1",
    date: new Date(2025, 5, 10), // Junio 10, 2025
    description: "Fecha límite para la primera tarea del curso de Gramática.",
    type: "task",
  },
  {
    id: "e3",
    title: "Clase en Vivo: Fonética",
    date: new Date(2025, 5, 15), // Junio 15, 2025
    description: "Clase en vivo sobre fonética Kamentsa con el profesor Juan.",
    type: "live_class",
  },
  {
    id: "e4",
    title: "Fin Curso Kamentsa",
    date: new Date(2025, 5, 20), // Junio 20, 2025
    description: "Finalización del curso de Introducción al Kamentsa.",
    type: "course",
  },
  {
    id: "e5",
    title: "Reunión de Equipo",
    date: new Date(2025, 5, 27), // Junio 27, 2025 (hoy)
    description: "Reunión semanal del equipo de desarrollo.",
    type: "other",
  },
];

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const eventsForSelectedDate = mockEvents.filter(event =>
    selectedDate && format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) { // Solo procesar si la fecha no es undefined
      const events = mockEvents.filter(event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
      if (events.length > 0) {
        setSelectedEvent(events[0]); // Mostrar el primer evento del día
        setIsDialogOpen(true);
      } else {
        setSelectedEvent(null);
        setIsDialogOpen(false);
      }
    } else {
      setSelectedEvent(null);
      setIsDialogOpen(false);
    }
  };

  // Función para renderizar contenido personalizado en las celdas del calendario
  const renderDay = (day: Date) => {
    const dayEvents = mockEvents.filter(event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    return (
      <div className="relative text-center h-full w-full flex flex-col items-center justify-center">
        <span className="text-sm font-medium">{format(day, 'd')}</span>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 text-xs text-primary font-semibold truncate w-full px-1">
            {dayEvents[0].title} {/* Mostrar el título del primer evento */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Calendario de Actividades</h1>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDayClick}
          className="rounded-md border shadow"
          locale={es} // Establecer el idioma a español
          components={{
            DayContent: ({ date }) => renderDay(date),
          }}
        />
      </div>

      {selectedEvent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                {format(selectedEvent.date, "PPP", { locale: es })}
              </DialogDescription>
            </DialogHeader>
            <p>{selectedEvent.description}</p>
            <p className="text-sm text-muted-foreground">Tipo: {selectedEvent.type}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarPage;
