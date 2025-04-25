import Form from "@/components/common/Form";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui/";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const [contentType, setContentType] = useState("");
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [editContent, setEditContent] = useState<ContentItem | null>(null); // Use the defined type
  const [loading, setLoading] = useState(true);

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [contentTypeError, setContentTypeError] = useState("");
  const [contentError, setContentError] = useState("");
  const [content, setContent] = useState<string | File[] | File | null>(null); // Updated state type

  useEffect(() => {
    if (editContent) {
      setTitle(editContent.title);
      setDescription(editContent.description);
      setCategory(editContent.category);
      setTags(editContent.tags);
      setContentType(editContent.type);
      setContent(editContent.type === "texto" ? editContent.content : null);
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setContentType("");
      setContent(null);
    }
  }, [editContent]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data: ContentItem[] = await api.get("/contents");
        setContents(data);
      } catch (error: unknown) {
        toast.error("Error!", {
          description: "Hubo un error al obtener los contenidos.",
        });
        console.error("Error al obtener los contenidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const validateForm = () => {
    let isValid = true;
    setTitleError("");
    setDescriptionError("");
    setCategoryError("");
    setContentTypeError("");
    setContentError("");

    if (!title) {
      setTitleError("El título es obligatorio.");
      isValid = false;
    }

    if (!description) {
      setDescriptionError("La descripción es obligatoria.");
      isValid = false;
    }

    if (!category) {
      setCategoryError("La categoría es obligatoria.");
      isValid = false;
    }

    if (!contentType) {
      setContentTypeError("El tipo de contenido es obligatorio.");
      isValid = false;
    }

    if (contentType === "texto" && !content) {
      setContentError("El contenido es obligatorio.");
      isValid = false;
    }

    if (
      (contentType === "imagen" ||
        contentType === "video" ||
        contentType === "audio") &&
      !content
    ) {
      setContentError("El archivo es obligatorio.");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newContent: ContentItem = {
        id: editContent ? editContent.id : contents.length + 1,
        title,
        description,
        category,
        tags,
        type: contentType,
        content:
          contentType === "texto"
            ? (content as string | null)
            : content instanceof File
            ? content.name
            : null,
      };

      const method = editContent ? "PUT" : "POST";
      const url = editContent ? `/contents/${editContent.id}` : `/contents`;

      let body;
      if (contentType === "texto") {
        body = JSON.stringify(newContent);
      } else {
        const formData = new FormData();
        if (Array.isArray(content)) {
          content.forEach((file) => {
            formData.append("content", file);
          });
        } else if (content instanceof File) {
          formData.append("content", content);
        }
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("type", contentType);
        body = formData;
      }

      try {
        if (method === "PUT") {
          await api.put(url, body as unknown);
        } else {
          await api.post(url, body as unknown);
        }

        toast.success("Contenido guardado!", {
          description: "El contenido se ha guardado correctamente.",
        });
      } catch (error: unknown) {
        toast.error("Error!", {
          description: "Hubo un error al guardar el contenido.",
        });
        if (error instanceof Error) {
          console.error("Error al guardar el contenido:", error.message);
        } else {
          console.error("Error al guardar el contenido:", error);
        }
      }

      setShowForm(false);
      setEditContent(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setContentType("");
      setContent(null);
    } catch (error: unknown) {
      console.error("Error al guardar el contenido:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/contents/${id}`);

      toast.success("Contenido eliminado!", {
        description: "El contenido se ha eliminado correctamente.",
      });

      setContents(contents.filter((c) => c.id !== id));
    } catch (error: unknown) {
      toast.error("Error!", {
        description: "Hubo un error al eliminar el contenido.",
      });
      console.error("Error al eliminar el contenido:", error);
    }
  };

  const handleEdit = (content: ContentItem) => {
    // Add type for content
    setEditContent(content);
    setShowForm(true);
    setTitle(content.title);
    setDescription(content.description);
    setCategory(content.category);
    setTags(content.tags);
    setContentType(content.type);
    setContent(content.type === "texto" ? content.content : null);
  };

  return (
    <div>
      <h2>Gestión de Contenidos</h2>
      <Button
        onClick={() => {
          setShowForm(!showForm);
          setEditContent(null);
          setTitle("");
          setDescription("");
          setCategory("");
          setTags("");
          setContentType("");
          setContent(null);
          setTitleError("");
          setDescriptionError("");
          setCategoryError("");
          setContentTypeError("");
          setContentError("");
        }}
      >
        Crear Nuevo Contenido
      </Button>
      {(showForm || editContent) && (
        <Form
          title={editContent ? "Editar Contenido" : "Crear Nuevo Contenido"}
          description="Ingrese la información del nuevo contenido."
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditContent(null);
            setTitle("");
            setDescription("");
            setCategory("");
            setTags("");
            setContentType("");
            setContent(null);
            setTitleError("");
            setDescriptionError("");
            setCategoryError("");
            setContentTypeError("");
            setContentError("");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <p className="text-red-500">{titleError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && <p className="text-red-500">{descriptionError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="categoria1">Categoría 1</SelectItem>
                <SelectItem value="categoria2">Categoría 2</SelectItem>
                <SelectItem value="categoria3">Categoría 3</SelectItem>
              </SelectContent>
            </Select>
            {categoryError && <p className="text-red-500">{categoryError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Contenido</Label>
            <Select
              onValueChange={setContentType}
              value={contentType}
            >
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
            {contentTypeError && <p className="text-red-500">{contentTypeError}</p>}
          </div>
          {contentType === "texto" ? (
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <ReactQuill
                id="content"
                value={content as string}
                onChange={setContent}
                className="h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-popover file:text-popover-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {contentError && <p className="text-red-500">{contentError}</p>}
            </div>
          ) : contentType === "imagen" ||
            contentType === "video" ||
            contentType === "audio" ? (
            <div className="grid gap-2">
              <Label htmlFor="content">Archivo</Label>
              <Input
                id="content"
                type="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : null;
                  setContent(files);
                }}
              />
              {contentError && <p className="text-red-500">{contentError}</p>}
              {Array.isArray(content) && content.length > 0 && (
                <div>
                  <h4>Archivos seleccionados:</h4>
                  <div className="flex flex-wrap">
                    {content.map((file: File, index: number) => (
                      <div
                        key={index}
                        className="w-24 h-24 m-1 border rounded relative"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-sm text-center">{file.name}</p>
                        )}
                        <button
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() => {
                            const newContent = [...content];
                            newContent.splice(index, 1);
                            setContent(newContent);
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Cargando contenidos...</TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Aquí se implementará la lógica para la gestión de contenidos */}
    </div>
  );
};

export default ContentManager;
