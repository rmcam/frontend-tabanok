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

const CategoryManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Categoría 1",
    },
    {
      id: 2,
      name: "Categoría 2",
    },
    {
      id: 3,
      name: "Categoría 3",
    },
  ]);
  const [editCategory, setEditCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (editCategory) {
      setCategoryName(editCategory.name);
    } else {
      setCategoryName("");
    }
  }, [editCategory]);

  const handleSave = () => {
    if (!categoryName.trim()) {
      // Basic validation
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    if (editCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editCategory.id
            ? {
                ...c,
                name: categoryName,
              }
            : c
        )
      );
    } else {
      setCategories([
        ...categories,
        {
          id: categories.length + 1, // Simple ID generation
          name: categoryName,
        },
      ]);
    }

    setShowForm(false);
    setEditCategory(null);
    setCategoryName(""); // Clear input after saving
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const handleEdit = (category: { id: number; name: string }) => {
    setEditCategory(category);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Gestión de Categorías</h2>
      <Button
        onClick={() => {
          setShowForm(!showForm);
          setEditCategory(null); // Clear edit state when toggling form
          setCategoryName(""); // Clear input when toggling form
        }}
      >
        Crear Nueva Categoría
      </Button>
      {(showForm || editCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
            </CardTitle>
            <CardDescription>
              Ingrese la información de la nueva categoría.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave}>Guardar</Button>
          </CardFooter>
        </Card>
      )}
      <div>
        <h3>Categorías Existentes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(category.id)}>
                    Eliminar
                  </Button>
                  <Button onClick={() => handleEdit(category)}>Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManager;
