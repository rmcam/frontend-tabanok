import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Assuming sonner is used for notifications
import api from "@/lib/api"; // Import the api object

interface Tag {
  id: string; // Cambiado a string asumiendo UUIDs en el backend
  name: string;
}

const TagManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");
  const [tagNameError, setTagNameError] = useState(""); // Add state for validation error
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (editTag) {
      setTagName(editTag.name);
      setTagNameError(""); // Clear error when editing
    } else {
      setTagName("");
      setTagNameError(""); // Clear error when creating new
    }
  }, [editTag]);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      //const data = await api.get("/tags"); // Use api.get
      setTags([]);
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar etiquetas.";
      toast.error(`Error al cargar las etiquetas: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tagName.trim()) {
      setTagNameError("El nombre de la etiqueta es obligatorio."); // Set validation error state
      return;
    }

    setTagNameError(""); // Clear error if validation passes
    setIsLoading(true);
    try {
      if (editTag) {
        await api.put(`/tags/${editTag.id}`, { name: tagName }); // Use api.put
        toast.success("Etiqueta actualizada exitosamente.");
      } else {
        await api.post("/tags", { name: tagName }); // Use api.post
        toast.success("Etiqueta creada exitosamente.");
      }
      fetchTags(); // Refresh the list
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar etiqueta.";
      const action = editTag ? "actualizar" : "crear";
      toast.error(`Error al ${action} la etiqueta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setShowForm(false);
      setEditTag(null);
      setTagName("");
    }
  };

  const handleDelete = async (id: string) => { // Cambiado a string
    setIsLoading(true);
    try {
      await api.delete(`/tags/${id}`); // Use api.delete
      toast.success("Etiqueta eliminada exitosamente.");
      fetchTags(); // Refresh the list
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar etiqueta.";
      toast.error(`Error al eliminar la etiqueta: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditTag(tag);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Gestión de Etiquetas</h2>
      <Button
        onClick={() => {
          setShowForm(!showForm);
          setEditTag(null); // Clear edit state when toggling form
          setTagName(""); // Clear input when toggling form
        }}
        disabled={isLoading}
      >
        {showForm ? "Cancelar" : "Crear Nueva Etiqueta"}
      </Button>
      {(showForm || editTag) && (
        <Card className="bg-tabanok-violeta-claro">
          <CardHeader>
            <CardTitle className="text-morado-oscuro">
              {editTag ? "Editar Etiqueta" : "Crear Nueva Etiqueta"}
            </CardTitle>
            <CardDescription>
              Ingrese la información de la etiqueta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => {
                  setTagName(e.target.value);
                  setTagNameError(""); // Clear error on input change
                }}
                disabled={isLoading}
                aria-invalid={!!tagNameError} // Add aria-invalid
                aria-describedby={tagNameError ? "tag-name-error" : undefined} // Add aria-describedby
              />
              {tagNameError && <p id="tag-name-error" className="text-red-500 text-sm">{tagNameError}</p>} {/* Add id to error message */}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </CardFooter>
        </Card>
      )}
      <div>
        <h3>Etiquetas Existentes</h3>
        {isLoading ? (
          <p>Cargando etiquetas...</p>
        ) : tags.length === 0 ? (
          <p>No hay etiquetas disponibles.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(tag.id)} disabled={isLoading}>
                      Eliminar
                    </Button>
                    <Button onClick={() => handleEdit(tag)} disabled={isLoading}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TagManager;
