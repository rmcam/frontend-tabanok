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

interface Category {
  id: number;
  name: string;
}

const CategoryManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editCategory) {
      setCategoryName(editCategory.name);
    } else {
      setCategoryName("");
    }
  }, [editCategory]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/categories"); // Use api.get
      setCategories(data);
    } catch (error: any) {
      toast.error(`Error al cargar las categorías: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.warning("El nombre de la categoría no puede estar vacío.");
      return;
    }

    setIsLoading(true);
    try {
      if (editCategory) {
        await api.put(`/categories/${editCategory.id}`, { name: categoryName }); // Use api.put
        toast.success("Categoría actualizada exitosamente.");
      } else {
        await api.post("/categories", { name: categoryName }); // Use api.post
        toast.success("Categoría creada exitosamente.");
      }
      fetchCategories(); // Refresh the list
    } catch (error: any) {
      const action = editCategory ? "actualizar" : "crear";
      toast.error(`Error al ${action} la categoría: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowForm(false);
      setEditCategory(null);
      setCategoryName("");
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await api.delete(`/categories/${id}`); // Use api.delete
      toast.success("Categoría eliminada exitosamente.");
      fetchCategories(); // Refresh the list
    } catch (error: any) {
      toast.error(`Error al eliminar la categoría: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
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
        disabled={isLoading}
      >
        {showForm ? "Cancelar" : "Crear Nueva Categoría"}
      </Button>
      {(showForm || editCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
            </CardTitle>
            <CardDescription>
              Ingrese la información de la categoría.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
        <h3>Categorías Existentes</h3>
        {isLoading ? (
          <p>Cargando categorías...</p>
        ) : categories.length === 0 ? (
          <p>No hay categorías disponibles.</p>
        ) : (
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
                    <Button onClick={() => handleDelete(category.id)} disabled={isLoading}>
                      Eliminar
                    </Button>
                    <Button onClick={() => handleEdit(category)} disabled={isLoading}>
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

export default CategoryManager;
