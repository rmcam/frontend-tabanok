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
  id: number;
  name: string;
}

const TagManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (editTag) {
      setTagName(editTag.name);
    } else {
      setTagName("");
    }
  }, [editTag]);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/tags"); // Use api.get
      setTags(data);
    } catch (error: any) {
      toast.error(`Error al cargar las etiquetas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tagName.trim()) {
      toast.warning("El nombre de la etiqueta no puede estar vacío.");
      return;
    }

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
    } catch (error: any) {
      const action = editTag ? "actualizar" : "crear";
      toast.error(`Error al ${action} la etiqueta: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowForm(false);
      setEditTag(null);
      setTagName("");
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/tags/${id}`); // Use api.delete
      toast.success("Etiqueta eliminada exitosamente.");
      fetchTags(); // Refresh the list
    } catch (error: any) {
      toast.error(`Error al eliminar la etiqueta: ${error.message}`);
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
        <Card>
          <CardHeader>
            <CardTitle>
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
                onChange={(e) => setTagName(e.target.value)}
                disabled={isLoading}
              />
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
