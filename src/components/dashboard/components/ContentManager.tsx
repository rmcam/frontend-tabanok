import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react'; // Import useEffect
// import CategoryManager from './CategoryManager'; // Removed unused import
// import TagManager from './TagManager'; // Removed unused import
import Form from '@/components/common/Form';

// Define a type for content items
interface ContentItem {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  type: string;
  content: string | null; // Store text content or file name
}

const ContentManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [contentType, setContentType] = useState('');
  const [contents, setContents] = useState<ContentItem[]>([ // Use the defined type
    {
      id: 1,
      title: 'Contenido 1',
      description: 'Descripción del contenido 1',
      category: 'Categoría 1',
      tags: 'tag1, tag2',
      type: 'texto',
      content: 'Este es el contenido de texto 1',
    },
    {
      id: 2,
      title: 'Contenido 2',
      description: 'Descripción del contenido 2',
      category: 'Categoría 2',
      tags: 'tag3, tag4',
      type: 'imagen',
      content: null, // Representing a file, actual file object won't be stored here
    },
    {
      id: 3,
      title: 'Contenido 3',
      description: 'Descripción del contenido 3',
      category: 'Categoría 3',
      tags: 'tag5, tag6',
      type: 'video',
      content: null, // Representing a file
    },
  ]);
  const [editContent, setEditContent] = useState<ContentItem | null>(null); // Use the defined type

  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState<string | File | null>(null); // Updated state type

  // Populate form fields when editing
  useEffect(() => {
    if (editContent) {
      setTitle(editContent.title);
      setDescription(editContent.description);
      setCategory(editContent.category);
      setTags(editContent.tags);
      setContentType(editContent.type);
      // Set content only if it's text, otherwise it's a file input
      setContent(editContent.type === 'texto' ? editContent.content : null);
    } else {
      // Clear form fields when not editing
      setTitle('');
      setDescription('');
      setCategory('');
      setTags('');
      setContentType('');
      setContent(null);
    }
  }, [editContent]);


  const handleSave = () => {
    const newContent: ContentItem = { // Use the defined type
      id: editContent ? editContent.id : contents.length + 1, // Simple ID generation
      title,
      description,
      category,
      tags,
      type: contentType,
      content: contentType === 'texto' ? (content as string | null) : (content instanceof File ? content.name : null), // Store file name or text content
    };

    if (editContent) {
      setContents(contents.map((c) => (c.id === editContent.id ? newContent : c)));
    } else {
      setContents([...contents, newContent]);
    }

    // alert(JSON.stringify(newContent, null, 2)); // Keep alert for now as placeholder

    setShowForm(false);
    setEditContent(null);
  };

  const handleDelete = (id: number) => { // Add type for id
    setContents(contents.filter((c) => c.id !== id));
  };

  const handleEdit = (content: ContentItem) => { // Add type for content
    setEditContent(content);
    setShowForm(true); // Show form when editing
  };


  return (
    <div>
      <h2>Gestión de Contenidos</h2>
      <Button onClick={() => {
        setShowForm(!showForm);
        setEditContent(null); // Clear edit state when toggling form
      }}>Crear Nuevo Contenido</Button>
      {(showForm || editContent) && (
        <Form
          title={editContent ? 'Editar Contenido' : 'Crear Nuevo Contenido'}
          description="Ingrese la información del nuevo contenido."
          onSubmit={handleSave} // Use the refactored handleSave
          onCancel={() => {
            setShowForm(false);
            setEditContent(null); // Clear edit state on cancel
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            {/* Integrate CategoryManager here */}
             <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with dynamic categories from CategoryManager */}
                <SelectItem value="categoria1">Categoría 1</SelectItem>
                <SelectItem value="categoria2">Categoría 2</SelectItem>
                <SelectItem value="categoria3">Categoría 3</SelectItem>
              </SelectContent>
            </Select>
            {/* <CategoryManager /> */} {/* Remove this line */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Etiquetas</Label>
            {/* Integrate TagManager here */}
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            {/* <TagManager /> */} {/* Remove this line */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Contenido</Label>
            <Select onValueChange={setContentType} value={contentType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Seleccione un tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="texto">Texto</SelectItem>
                <SelectItem value="imagen">Imagen</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {contentType === 'texto' ? (
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea id="content" value={content as string} onChange={(e) => setContent(e.target.value)} />
            </div>
          ) : (contentType === 'imagen' || contentType === 'video' || contentType === 'audio') ? (
            <div className="grid gap-2">
              <Label htmlFor="content">Archivo</Label>
              <Input id="content" type="file" onChange={(e) => setContent(e.target.files ? e.target.files[0] : null)} />
            </div>
          ) : null}
        </Form>
      )}
      <div>
        <h3>Contenidos Existentes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Etiquetas</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.title}</TableCell>
                <TableCell>{content.description}</TableCell>
                <TableCell>{content.category}</TableCell>
                <TableCell>{content.tags}</TableCell>
                <TableCell>{content.type}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(content.id)}>
                    Eliminar
                  </Button>
                  <Button onClick={() => handleEdit(content)}>Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Aquí se implementará la lógica para la gestión de contenidos */}
    </div>
  );
};

export default ContentManager;
