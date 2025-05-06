import React, { useState } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

const ActivityCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    if (!title) {
      toast.error("Error!", {
        description: "El título es obligatorio.",
      });
      return;
    }

    if (title.length < 3) {
      toast.error("Error!", {
        description: "El título debe tener al menos 3 caracteres.",
      });
      return;
    }

    if (!/^[a-zA-Z0-9\s]*$/.test(title)) {
      toast.error("Error!", {
        description: "El título solo puede contener letras, números y espacios.",
      });
      return;
    }

    if (description.length < 10) {
      toast.error("Error!", {
        description: "La descripción debe tener al menos 10 caracteres.",
      });
      return;
    }

    try {
      const newActivity = {
        title,
        description,
      };

      await api.post("/activities", newActivity);

      toast.success("Actividad creada!", {
        description: "La actividad se ha guardado correctamente.",
      });
      setTitle("");
      setDescription("");
      setIsLoading(false);
    } catch (error: unknown) {
      toast.error("Error!", {
        description: "Hubo un error al guardar la actividad.",
      });
      console.error("Error al guardar la actividad:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
<FaPlusCircle size={24} className="mr-2" aria-label="Crear Actividad" />
        <h2 className="text-xl font-semibold">Creación de Actividades</h2>
      </div>
      <div className="mb-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Actividad"}
      </Button>
    </div>
  );
};

export default ActivityCreator;
