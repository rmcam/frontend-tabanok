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

const TagManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState([
    {
      id: 1,
      name: 'Tag 1',
    },
    {
      id: 2,
      name: 'Tag 2',
    },
    {
      id: 3,
      name: 'Tag 3',
    },
  ]);
  const [editTag, setEditTag] = useState(null);

  const handleSave = () => {
    if (typeof document !== 'undefined') {
      const name = (document.getElementById('name') as HTMLInputElement).value;

      if (editTag) {
        setTags(
          tags.map((t) =>
            t.id === editTag.id
              ? {
                  ...t,
                  name: name,
                }
              : t,
          ),
        );
      } else {
        setTags([
          ...tags,
          {
            id: tags.length + 1,
            name: name,
          },
        ]);
      }
    }

    setShowForm(false);
    setEditTag(null);
  };

  return (
    <div>
      <h2>Gestión de Etiquetas</h2>
      <Button onClick={() => setShowForm(!showForm)}>Crear Nueva Etiqueta</Button>
      {(showForm || editTag) && (
        <Card>
          <CardHeader>
            <CardTitle>{editTag ? 'Editar Etiqueta' : 'Crear Nueva Etiqueta'}</CardTitle>
            <CardDescription>Ingrese la información de la nueva etiqueta.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue={editTag?.name || ''} />
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
                  <Button onClick={() => setTags(tags.filter((t) => t.id !== tag.id))}>
                    Eliminar
                  </Button>
                  <Button onClick={() => setEditTag(tag)}>Editar</Button>
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
