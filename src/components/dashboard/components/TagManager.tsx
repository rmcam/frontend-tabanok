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

const TagManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState([
    {
      id: 1,
      name: "Tag 1",
    },
    {
      id: 2,
      name: "Tag 2",
    },
    {
      id: 3,
      name: "Tag 3",
    },
  ]);
  const [editTag, setEditTag] = useState<{ id: number; name: string } | null>(
    null
  );
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (editTag) {
      setTagName(editTag.name);
    } else {
      setTagName("");
    }
  }, [editTag]);

  const handleSave = () => {
    if (!tagName.trim()) {
      // Basic validation
      alert("El nombre de la etiqueta no puede estar vacío.");
      return;
    }

    if (editTag) {
      setTags(
        tags.map((t) =>
          t.id === editTag.id
            ? {
                ...t,
                name: tagName,
              }
            : t
        )
      );
    } else {
      setTags([
        ...tags,
        {
          id: tags.length + 1, // Simple ID generation
          name: tagName,
        },
      ]);
    }

    setShowForm(false);
    setEditTag(null);
    setTagName(""); // Clear input after saving
  };

  const handleDelete = (id: number) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  const handleEdit = (tag: { id: number; name: string }) => {
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
      >
        Crear Nueva Etiqueta
      </Button>
      {(showForm || editTag) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editTag ? "Editar Etiqueta" : "Crear Nueva Etiqueta"}
            </CardTitle>
            <CardDescription>
              Ingrese la información de la nueva etiqueta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave}>Guardar</Button>
          </CardFooter>
        </Card>
      )}
      <div>
        <h3>Etiquetas Existentes</h3>
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
                  <Button onClick={() => handleDelete(tag.id)}>Eliminar</Button>
                  <Button onClick={() => handleEdit(tag)}>Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TagManager;
