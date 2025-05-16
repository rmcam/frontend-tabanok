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

interface Category { // Asumiendo que 'Category' en el frontend se mapea a 'Topic' en el backend
  id: string; // Cambiado a string asumiendo UUIDs en el backend
  name: string; // Asumiendo que el campo se llama 'name' o 'title' en el backend
}

const CategoryManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]) // Lista de 'Topics'
  const [editCategory, setEditCategory] = useState<Category | null>(null); // 'Topic' a editar
  const [categoryName, setCategoryName] = useState(""); // Nombre del 'Topic'
  const [categoryNameError, setCategoryNameError] = useState(""); // Add state for validation error
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editCategory) {
      setCategoryName(editCategory.name); // Usar 'name', ajustar si es 'title'
      setCategoryNameError(""); // Clear error when editing
    } else {
      setCategoryName("");
      setCategoryNameError(""); // Clear error when creating new
    }
  }, [editCategory]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // TODO: Verificar la estructura exacta de la respuesta del endpoint /topics
      const response = await api.get("/topics"); // Usar endpoint /topics
      const data: Category[] = response.data; // Asumiendo que la respuesta es un array de Topics con id y name
      setCategories(data); // Asumiendo que la respuesta es un array de Topics con id y name
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar temas.";
      toast.error(`Error al cargar los temas: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setCategoryNameError("El nombre del tema es obligatorio."); // Set validation error state
      return;
    }

    setCategoryNameError(""); // Clear error if validation passes
    setIsLoading(true);
    try {
      if (editCategory) {
        // TODO: Verificar el payload y el endpoint de actualización de topics
        await api.patch(`/topics/${editCategory.id}`, { name: categoryName }); // Usar endpoint /topics y PATCH para actualizar
        toast.success("Tema actualizado exitosamente.");
      } else {
        // TODO: Verificar el payload y el endpoint de creación de topics
        await api.post("/topics", { name: categoryName }); // Usar endpoint /topics para crear
        toast.success("Tema creado exitosamente.");
      }
      fetchCategories(); // Refresh the list
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar tema.";
      const action = editCategory ? "actualizar" : "crear";
      toast.error(`Error al ${action} el tema: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setShowForm(false);
      setEditCategory(null);
      setCategoryName("");
    }
  };

  const handleDelete = async (id: string) => { // Cambiado a string
    setIsLoading(true);
    try {
      // TODO: Verificar el endpoint de eliminación de topics
      await api.delete(`/topics/${id}`); // Usar endpoint /topics para eliminar
      toast.success("Tema eliminado exitosamente.");
      fetchCategories(); // Refresh the list
    } catch (error: unknown) { // Change any to unknown
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar tema.";
      toast.error(`Error al eliminar el tema: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => { // 'category' es en realidad un 'topic'
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
        <Card className="bg-tabanok-violeta-claro">
          <CardHeader>
            <CardTitle className="text-morado-oscuro">
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
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setCategoryNameError(""); // Clear error on input change
                }}
                disabled={isLoading}
                aria-invalid={!!categoryNameError} // Add aria-invalid
                aria-describedby={categoryNameError ? "category-name-error" : undefined} // Add aria-describedby
              />
              {categoryNameError && <p id="category-name-error" className="text-red-500 text-sm">{categoryNameError}</p>} {/* Add id to error message */}
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
        ) : Array.isArray(categories) && categories.length > 0 ? (
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
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
