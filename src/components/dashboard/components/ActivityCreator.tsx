import React, { useState } from 'react';
import { FaPlusCircle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import { Label } from "@/components/ui/label"; // Import Label component
import { toast } from "sonner";
import api from "@/lib/api";

const ActivityCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState(""); // Add state for title error
  const [descriptionError, setDescriptionError] = useState(""); // Add state for description error
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setTitleError(""); // Clear previous errors
    setDescriptionError("");

    if (!title) {
      setTitleError("El título es obligatorio.");
      isValid = false;
    } else if (title.length < 3) {
      setTitleError("El título debe tener al menos 3 caracteres.");
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s]*$/.test(title)) {
      setTitleError("El título solo puede contener letras, números y espacios.");
      isValid = false;
    }

    if (!description) {
      setDescriptionError("La descripción es obligatoria.");
      isValid = false;
    } else if (description.length < 10) {
      setDescriptionError("La descripción debe tener al menos 10 caracteres.");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

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
        <Label htmlFor="title">Título</Label> {/* Use Label component */}
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(""); // Clear error on input change
          }}
          disabled={isLoading} // Disable input while saving
          aria-invalid={!!titleError} // Add aria-invalid
          aria-describedby={titleError ? "title-error" : undefined} // Add aria-describedby
        />
        {titleError && <p id="title-error" className="text-red-500 text-sm">{titleError}</p>} {/* Add id to error message */}
      </div>
      <div className="mb-4">
        <Label htmlFor="description">Descripción</Label> {/* Use Label component */}
        <Textarea // Use Textarea component
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionError(""); // Clear error on input change
          }}
          disabled={isLoading} // Disable textarea while saving
          aria-invalid={!!descriptionError} // Add aria-invalid
          aria-describedby={descriptionError ? "description-error" : undefined} // Add aria-describedby
        />
        {descriptionError && <p id="description-error" className="text-red-500 text-sm">{descriptionError}</p>} {/* Add id to error message */}
      </div>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Actividad"}
      </Button>
    </div>
  );
};

export default ActivityCreator;
