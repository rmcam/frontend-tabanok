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
import { useEffect, useState, useMemo } from "react"; // Import useMemo
import { toast } from "sonner";
import api from "@/lib/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import clsx from 'clsx'; // Import clsx
import MultimediaPlayer from "../../common/MultimediaPlayer"; // Import MultimediaPlayer
import useFormValidation from "@/hooks/useFormValidation"; // Import useFormValidation

// Define a type for multimedia items (copied from MultimediaGallery.tsx)
interface MultimediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  url: string;
  lessonId: string; // Assuming multimedia is linked to lessons, might need adjustment
  metadata: object;
}

// Define a type for content items
interface ContentItem {
  id: number;
  title: string;
  description: string;
  category: string; // Assuming category is represented by name or ID
  tags: string[]; // Assuming tags are an array of strings
  type: string;
  content: string | null; // Store text content or file name
  multimediaItems?: MultimediaItem[]; // Optional list of associated multimedia items
}

interface Category {
  id: number;
  name: string;
}

// interface Tag { // Removed as it's not used
//   id: number;
//   name: string;
// }

interface ContentFormValues {
  title: string;
  description: string;
  category: string;
  contentType: string;
}


const ContentManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [editContent, setEditContent] = useState<ContentItem | null>(null); // Use the defined type
  const [loading, setLoading] = useState(true);
  const [isLoadingSave, setIsLoadingSave] = useState(false); // Loading state for save operation
  const [isLoadingDelete, setIsLoadingDelete] = useState(false); // Loading state for delete operation
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  // const [availableTags, setAvailableTags] = useState<Tag[]>([]); // State for available tags - Removed as it's not used
  const [associatedMultimedia, setAssociatedMultimedia] = useState<MultimediaItem[]>([]); // State for associated multimedia


  // State for form fields (reverted to individual states)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // Store selected category ID or name
  const [contentType, setContentType] = useState(""); // Store selected content type

  // State for tags and content file/text
  const [tags, setTags] = useState<string[]>([]); // Store selected tags as array of strings
  const [tagInput, setTagInput] = useState(""); // Input for adding tags
  const [content, setContent] = useState<string | File[] | File | null>(null); // Updated state type
  const [contentError, setContentError] = useState(""); // Error for content file/text


  // Use useFormValidation for validation and error handling
  const initialFormValues: ContentFormValues = useMemo(() => ({
    title: title, // Use individual state
    description: description, // Use individual state
    category: category, // Use individual state
    contentType: contentType, // Use individual state
  }), [title, description, category, contentType]); // Add dependencies

  const validationRules = useMemo(() => ({
    title: (value: string) => (value.trim() ? undefined : 'El título es obligatorio.'),
    description: (value: string) => (value.trim() ? undefined : 'La descripción es obligatoria.'),
    category: (value: string) => (value ? undefined : 'La categoría es obligatoria.'),
    contentType: (value: string) => (value ? undefined : 'El tipo de contenido es obligatorio.'),
  }), []);


  const {
    errors,
    handleSubmit,
    setErrors,
  } = useFormValidation<ContentFormValues>(initialFormValues); // Explicitly set the generic type


  // Destructure errors for easier access
  const { title: titleError, description: descriptionError, category: categoryError, contentType: contentTypeError } = errors;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentsData, categoriesData] = await Promise.all([ // Removed tagsData from destructuring
          api.get("/contents"),
          api.get("/categories"),
          api.get("/tags"), // Still fetch tags if needed elsewhere, but not assigned to availableTags state
        ]);
        setContents(contentsData);
        setCategories(categoriesData);
        // setAvailableTags(tagsData); // Removed setting availableTags state
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar datos iniciales.";
        toast.error(`Error al cargar los contenidos: ${errorMessage}`);
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (editContent) {
      setTitle(editContent.title); // Update individual state
      setDescription(editContent.description); // Update individual state
      setCategory(editContent.category); // Update individual state
      setContentType(editContent.type); // Update individual state
      setTags(editContent.tags);
      setContent(editContent.type === "texto" ? editContent.content : null);
      setAssociatedMultimedia(editContent.multimediaItems || []); // Set associated multimedia
      setErrors({}); // Clear errors when editing
      setContentError(""); // Clear content error
    } else {
      setTitle(""); // Reset individual state
      setDescription(""); // Reset individual state
      setCategory(""); // Reset individual state
      setContentType(""); // Reset individual state
      setTags([]);
      setTagInput("");
      setContent(null);
      setAssociatedMultimedia([]); // Clear associated multimedia when creating new
      setErrors({}); // Clear errors when creating new
      setContentError(""); // Clear content error
    }
  }, [editContent, setErrors]); // Add dependencies


  const handleSave = async () => {
    // Use handleSubmit from the hook for initial validation
    // Adjusting the mock event type for compatibility
    const formValidationResult = handleSubmit(validationRules)({
      preventDefault: () => {},
      currentTarget: { elements: {} } // Provide a mock currentTarget
    } as unknown as React.FormEvent);


    // Perform additional validation for content file/text
    let isContentValid = true;
    setContentError(""); // Clear previous content error

    if (contentType === "texto" && (!content || (typeof content === 'string' && !content.trim()))) {
      setContentError("El contenido es obligatorio.");
      isContentValid = false;
    }

    if (
      (contentType === "imagen" ||
        contentType === "video" ||
        contentType === "audio") &&
      !content && (!editContent || (editContent && associatedMultimedia.length === 0))
    ) {
      setContentError("El archivo es obligatorio.");
      isContentValid = false;
    }

    if (!formValidationResult.isValid || !isContentValid) {
      return;
    }

    setIsLoadingSave(true); // Set loading state for save

    try {
      const contentData = {
        title, // Use individual state
        description, // Use individual state
        category, // Use individual state
        tags, // Send tags as array of strings
        type: contentType, // Use individual state
        content: contentType === "texto" ? (content as string | null) : null,
      };

      const method = editContent ? "PUT" : "POST";
      const url = editContent ? `/contents/${editContent.id}` : `/contents`;

      let body;
      if (contentType === "texto") { // Use individual state
        body = JSON.stringify(contentData);
      } else {
        const formData = new FormData();
        if (Array.isArray(content)) {
          content.forEach((file) => {
            formData.append("files", file); // Assuming backend expects 'files' for multimedia files
          });
        } else if (content instanceof File) {
          formData.append("files", content); // Assuming backend expects 'files' for multimedia files
        }
        formData.append("title", title); // Use individual state
        formData.append("description", description); // Use individual state
        formData.append("category", category); // Use individual state
        tags.forEach(tag => {
          formData.append("tags[]", tag); // Assuming backend expects 'tags[]' for array
        });
        formData.append("type", contentType); // Use individual state
        // If editing, include content ID
        if (editContent) {
          formData.append("id", editContent.id.toString());
          // Include IDs of associated multimedia to keep
          associatedMultimedia.forEach(media => {
            formData.append("existingMultimediaIds[]", media.id);
          });
        }
        body = formData;
      }

      if (method === "PUT") {
        await api.put(url, body as unknown)
          .then(() => {
            toast.success("Contenido actualizado!", {
              description: "El contenido se ha actualizado correctamente.",
            });
            // After successfully updating, refetch the list of contents
            api.get("/contents")
              .then((data: ContentItem[]) => {
                setContents(data);
              })
              .catch((error: unknown) => {
                toast.error("Error!", {
                  description: "Hubo un error al obtener los contenidos actualizados.",
                });
                console.error("Error al obtener los contenidos actualizados:", error);
              });
          })
          .catch((error: unknown) => {
            toast.error("Error!", {
              description: "Hubo un error al actualizar el contenido.",
            });
            console.error("Error al actualizar el contenido:", error);
          });
      } else {
        await api.post(url, body as unknown)
          .then(() => {
            toast.success("Contenido guardado!", {
              description: "El contenido se ha guardado correctamente.",
            });
            // After successfully creating a new content, fetch the updated list of contents
            api.get("/contents")
              .then((data: ContentItem[]) => {
                setContents(data);
              })
              .catch((error: unknown) => {
                toast.error("Error!", {
                  description: "Hubo un error al obtener los contenidos actualizados.",
                });
                console.error("Error al obtener los contenidos actualizados:", error);
              });
          })
          .catch((error: unknown) => {
            toast.error("Error!", {
              description: "Hubo un error al guardar el contenido.",
            });
            console.error("Error al guardar el contenido:", error);
          });
      }

      setShowForm(false);
      setEditContent(null);
      setTitle(""); // Reset individual state
      setDescription(""); // Reset individual state
      setCategory(""); // Reset individual state
      setContentType(""); // Reset individual state
      setTags([]);
      setTagInput("");
      setContent(null);
      setAssociatedMultimedia([]); // Clear associated multimedia after saving
      setErrors({}); // Clear errors on success
      setContentError(""); // Clear content error on success
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar contenido.";
      const action = editContent ? "actualizar" : "guardar";
      toast.error(`Error al ${action} el contenido: ${errorMessage}`);
      console.error("Error al guardar el contenido:", error);
    } finally {
      setIsLoadingSave(false); // Reset loading state for save
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoadingDelete(true); // Set loading state for delete
    try {
      await api.delete(`/contents/${id}`);

      toast.success("Contenido eliminado!", {
        description: "El contenido se ha eliminado correctamente.",
      });

      setContents(contents.filter((c) => c.id !== id));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar contenido.";
      toast.error(`Error al eliminar el contenido: ${errorMessage}`);
      console.error("Error al eliminar el contenido:", error);
    } finally {
      setIsLoadingDelete(false); // Reset loading state for delete
    }
  };

  const handleDeleteMultimedia = async (multimediaId: string) => {
    try {
      await api.delete(`/multimedia/${multimediaId}`); // Assuming DELETE /multimedia/:id endpoint

      toast.success("Archivo multimedia eliminado!", {
        description: "El archivo multimedia se ha eliminado correctamente.",
      });

      // Remove the deleted multimedia item from the associatedMultimedia state
      setAssociatedMultimedia(associatedMultimedia.filter(media => media.id !== multimediaId));

      // Optionally, refetch contents to ensure the table is updated
      api.get("/contents")
        .then((data: ContentItem[]) => {
          setContents(data);
        })
        .catch((error: unknown) => {
          toast.error("Error!", {
            description: "Hubo un error al obtener los contenidos actualizados después de eliminar multimedia.",
          });
          console.error("Error fetching updated contents after deleting multimedia:", error);
        });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al eliminar el archivo multimedia: ${errorMessage}`);
      console.error("Error al eliminar el archivo multimedia:", error);
    }
  };


  const handleEdit = (content: ContentItem) => {
    // Add type for content
    setEditContent(content);
    setShowForm(true);
    setTitle(content.title); // Update individual state
    setDescription(content.description); // Update individual state
    setCategory(content.category); // Update individual state
    setContentType(content.type); // Update individual state
    setTags(content.tags);
    setContent(content.type === "texto" ? content.content : null);
    setAssociatedMultimedia(content.multimediaItems || []); // Set associated multimedia
    setErrors({}); // Clear errors when editing
    setContentError(""); // Clear content error
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  return (
    <div>
      <h2>Gestión de Contenidos</h2>
      <Button
        onClick={() => {
          setShowForm(!showForm);
          setEditContent(null);
          setTitle(""); // Reset individual state
          setDescription(""); // Reset individual state
          setCategory(""); // Reset individual state
          setContentType(""); // Reset individual state
          setTags([]);
          setTagInput("");
          setContent(null);
          setAssociatedMultimedia([]); // Clear associated multimedia when creating new
          setErrors({}); // Clear errors when creating new
          setContentError(""); // Clear content error
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
            setTitle(""); // Reset individual state
            setDescription(""); // Reset individual state
            setCategory(""); // Reset individual state
            setContentType(""); // Reset individual state
            setTags([]);
            setTagInput("");
            setContent(null);
            setAssociatedMultimedia([]); // Clear associated multimedia on cancel
            setErrors({}); // Clear errors on cancel
            setContentError(""); // Clear content error
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Use grid for layout */}
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title" // Add name attribute
                value={title}
                onChange={(e) => { // Use individual state handler
                  setTitle(e.target.value);
                  setErrors({}); // Clear errors on change
                }}
                disabled={isLoadingSave} // Disable input while saving
                aria-invalid={!!titleError} // Add aria-invalid
                aria-describedby={titleError ? "content-title-error" : undefined} // Add aria-describedby
                className={titleError ? "border-red-500" : ""} // Add red border on error
              />
              {titleError && <p id="content-title-error" className="text-red-500 text-sm">{titleError}</p>} {/* Add id to error message */}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={category}
                onValueChange={(value) => { // Use individual state handler
                  setCategory(value);
                  setErrors({}); // Clear errors on change
                }}
                disabled={isLoadingSave} // Disable select while saving
                aria-invalid={!!categoryError} // Add aria-invalid
                aria-describedby={categoryError ? "content-category-error" : undefined} // Add aria-describedby
              >
                <SelectTrigger id="category" className={categoryError ? "border-red-500" : ""}> {/* Add red border on error */}
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}> {/* Assuming category value should be ID */}
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoryError && <p id="content-category-error" className="text-red-500 text-sm">{categoryError}</p>} {/* Add id to error message */}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description" // Add name attribute
              value={description}
              onChange={(e) => { // Use individual state handler
                setDescription(e.target.value);
                setErrors({}); // Clear errors on change
              }}
              disabled={isLoadingSave} // Disable textarea while saving
              aria-invalid={!!descriptionError} // Add aria-invalid
              aria-describedby={descriptionError ? "content-description-error" : undefined} // Add aria-describedby
              className={descriptionError ? "border-red-500" : ""} // Add red border on error
            />
            {descriptionError && <p id="content-description-error" className="text-red-500 text-sm">{descriptionError}</p>} {/* Add id to error message */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={isLoadingSave} // Disable input while saving
                // Add aria-invalid and aria-describedby if tags validation is added
              />
              <Button type="button" onClick={handleAddTag} disabled={isLoadingSave}>Agregar</Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveTag(tag)} disabled={isLoadingSave}>x</button>
                </span>
              ))}
            </div>
            {/* Add tagsError display if needed */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Contenido</Label>
            <Select
              value={contentType}
              onValueChange={(value) => { // Use individual state handler
                setContentType(value);
                setErrors({}); // Clear errors on change
                setContent(null); // Clear content/file when type changes
                setContentError(""); // Clear content error when type changes
              }}
              disabled={isLoadingSave} // Disable select while saving
              aria-invalid={!!contentTypeError} // Add aria-invalid
              aria-describedby={contentTypeError ? "content-type-error" : undefined} // Add aria-describedby
            >
              <SelectTrigger id="type" className={contentTypeError ? "border-red-500" : ""}> {/* Add red border on error */}
                <SelectValue placeholder="Seleccione un tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="texto">Texto</SelectItem>
                <SelectItem value="imagen">Imagen</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
            {contentTypeError && <p id="content-type-error" className="text-red-500 text-sm">{contentTypeError}</p>} {/* Add id to error message */}
          </div>
          {/* Display associated multimedia when editing */}
          {editContent && associatedMultimedia.length > 0 && (
            <div className="grid gap-2">
              <Label>Multimedia Asociada</Label>
              <div className="flex flex-wrap gap-2">
                {associatedMultimedia.map(media => (
                  <div key={media.id} className="relative border rounded p-2">
                     <MultimediaPlayer
                        type={media.type}
                        url={media.url}
                        title={media.title}
                        width={100} // Smaller size for display in form
                      />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => handleDeleteMultimedia(media.id)}
                      disabled={isLoadingDelete} // Disable delete multimedia button while deleting
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {contentType === "texto" ? (
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <ReactQuill
                id="content"
                value={content as string}
                onChange={(value) => {
                  setContent(value);
                  setContentError(""); // Clear error on content change
                }}
                className={clsx(
                  "h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-popover file:text-popover-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  contentError ? "border-red-500" : "" // Add red border on error
                )}
                aria-invalid={!!contentError} // Add aria-invalid
                aria-describedby={contentError ? "content-content-error" : undefined} // Add aria-describedby
              />
              {contentError && <p id="content-content-error" className="text-red-500 text-sm">{contentError}</p>} {/* Add id to error message */}
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
                  setContentError(""); // Clear error on file selection
                }}
                disabled={isLoadingSave} // Disable file input while saving
                aria-invalid={!!contentError} // Add aria-invalid
                aria-describedby={contentError ? "content-content-error" : undefined} // Add aria-describedby
                className={contentError ? "border-red-500" : ""} // Add red border on error
              />
              {contentError && <p id="content-content-error" className="text-red-500 text-sm">{contentError}</p>} {/* Add id to error message */}
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
                          disabled={isLoadingSave} // Disable remove file button while saving
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
                  <TableCell>{content.tags.join(', ')}</TableCell> {/* Display tags as comma-separated string */}
                  <TableCell>{content.type}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(content.id)} disabled={isLoadingDelete}>
                      Eliminar
                    </Button>
                    <Button onClick={() => handleEdit(content)} disabled={isLoadingDelete}>Editar</Button>
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
