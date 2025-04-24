import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

const CategoryManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Categoría 1',
    },
    {
      id: 2,
      name: 'Categoría 2',
    },
    {
      id: 3,
      name: 'Categoría 3',
    },
  ]);
  const [editCategory, setEditCategory] = useState(null);

  const handleSave = () => {
    if (typeof document !== 'undefined') {
      const name = (document.getElementById('name') as HTMLInputElement).value;

      if (editCategory) {
        setCategories(
          categories.map((c) =>
            c.id === editCategory.id
              ? {
                  ...c,
                  name: name,
                }
              : c,
          ),
        );
      } else {
        setCategories([
          ...categories,
          {
            id: categories.length + 1,
            name: name,
          },
        ]);
      }
    }

    setShowForm(false);
    setEditCategory(null);
  };

  return (
    <div>
      <h2>Gestión de Categorías</h2>
      <Button onClick={() => setShowForm(!showForm)}>Crear Nueva Categoría</Button>
      {(showForm || editCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>{editCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</CardTitle>
            <CardDescription>Ingrese la información de la nueva categoría.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue={editCategory?.name || ''} />
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
                  <Button onClick={() => setCategories(categories.filter((c) => c.id !== category.id))}>
                    Eliminar
                  </Button>
                  <Button onClick={() => setEditCategory(category)}>Editar</Button>
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
