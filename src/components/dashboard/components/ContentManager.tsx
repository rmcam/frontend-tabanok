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
import { useState, useMemo, useCallback, useEffect } from "react"; // Keep useEffect for editContent
import { toast } from "sonner";
import api from "@/lib/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MultimediaPlayer from "../../common/MultimediaPlayer"; // Import MultimediaPlayer
import useFormValidation from "@/hooks/useFormValidation"; // Import useFormValidation
import useFetchContentData from "@/hooks/useFetchContentData"; // Import the new hook

// Define a type for multimedia items (copied from MultimediaGallery.tsx)
interface MultimediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  url: string;
  lessonId: string; // Assuming multimedia is linked to lessons, might need adjustment
  metadata: object; // TODO: Define a more specific type for metadata
}

// Define a type for content items
export interface ContentItem {
  id: string; // Cambiado a string asumiendo UUIDs en el backend
  title: string;
  description: string;
  category: string; // Assuming category is represented by ID (string)
  tags: string[]; // Assuming tags are an array of strings
  type: string; // TODO: Define a union type for content types (e.g., 'text', 'image', 'video', 'audio')
  content: string | null; // Store text content or file name/path
  multimediaItems?: MultimediaItem[]; // Optional list of associated multimedia items
}

export interface Category { // Mapeado a 'Topic' en el backend
  id: string; // Cambiado a string asumiendo UUIDs en el backend
  name: string; // Asumiendo que el campo se llama 'name' o 'title' en el backend
}

// interface Tag { // Removed as it's not used
//   id: number;
//   name: string;
// }

// Define interface for consolidated form data
interface ContentFormData {
  title: string;
  description: string;
  category: string;
  contentType: string;
  tags: string[];
  tagInput: string; // Input for adding tags
  content: string | File[] | File | null; // Updated state type
  associatedMultimedia: MultimediaItem[]; // State for associated multimedia
  contentError: string; // Error for content file/text
}

// Define interface for useFormValidation
interface ContentFormValidationValues {
  title: string;
  description: string;
  category: string;
  contentType: string;
}


const ContentManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editContent, setEditContent] = useState<ContentItem | null>(null); // Use the defined type
  const [isLoadingSave, setIsLoadingSave] = useState(false); // Loading state for save operation
  const [isLoadingDelete, setIsLoadingDelete] = useState(false); // Loading state for delete operation

  // Use the new hook for fetching content data
  const { contents, categories, loading, refetch } = useFetchContentData();

  // Consolidated state for form fields
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    category: "",
    contentType: "",
    tags: [],
    tagInput: "",
    content: null,
    associatedMultimedia: [],
    contentError: "",
  });

  // Helper function to update form data
  const updateFormData = useCallback((updates: Partial<ContentFormData>) => {
    setFormData(prevData => ({ ...prevData, ...updates }));
  }, []);


  // Use useFormValidation for validation and error handling
  const initialFormValidationValues: ContentFormValidationValues = useMemo(() => ({
    title: formData.title,
    description: formData.description,
    category: formData.category,
    contentType: formData.contentType,
  }), [formData.title, formData.description, formData.category, formData.contentType]);

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
  } = useFormValidation<ContentFormValidationValues>(initialFormValidationValues); // Explicitly set the generic type


  // Destructure errors for easier access
  const { title: titleError, description: descriptionError, category: categoryError, contentType: contentTypeError } = errors;


  // Effect to populate form when editing existing content
  useEffect(() => {
    if (editContent) {
      setFormData({
        title: editContent.title,
        description: editContent.description,
        category: editContent.category, // Assuming editContent.category is the ID or name
        contentType: editContent.type,
        tags: editContent.tags,
        tagInput: "", // Reset tag input
        content: editContent.type === "texto" ? editContent.content : null,
        associatedMultimedia: editContent.multimediaItems || [], // Set associated multimedia
        contentError: "", // Clear content error
      });
      setErrors({}); // Clear errors when editing
    } else {
      // Reset form data when creating new content
      setFormData({
        title: "",
        description: "",
        category: "",
        contentType: "",
        tags: [],
        tagInput: "",
        content: null,
        associatedMultimedia: [],
        contentError: "",
      });
      setErrors({}); // Clear errors when creating new
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
    updateFormData({ contentError: "" }); // Clear previous content error

    if (formData.contentType === "texto" && (!formData.content || (typeof formData.content === 'string' && !formData.content.trim()))) {
      updateFormData({ contentError: "El contenido es obligatorio." });
      isContentValid = false;
    }

    if (
      (formData.contentType === "imagen" ||
        formData.contentType === "video" ||
        formData.contentType === "audio") &&
      !formData.content && (!editContent || (editContent && formData.associatedMultimedia.length === 0))
    ) {
      updateFormData({ contentError: "El archivo es obligatorio." });
      isContentValid = false;
    }

    if (!formValidationResult.isValid || !isContentValid) {
      return;
    }

    setIsLoadingSave(true); // Set loading state for save

    try {
      const contentData = {
        title: formData.title,
        description: formData.description,
        category: formData.category, // Send category ID or name
        tags: formData.tags, // Send tags as array of strings
        type: formData.contentType,
        content: formData.contentType === "texto" ? (formData.content as string | null) : null,
      };

      const method = editContent ? "PUT" : "POST"; // Backend uses PUT for update
      const url = editContent ? `/content/${editContent.id}` : `/content`; // Usar endpoint /content (singular)

      let body;
      if (formData.contentType === "texto") {
        body = JSON.stringify(contentData);
      } else {
        const formDataToSend = new FormData();
        if (Array.isArray(formData.content)) {
          formData.content.forEach((file) => {
            formDataToSend.append("files", file); // Assuming backend expects 'files' for multimedia files
          });
        } else if (formData.content instanceof File) {
          formDataToSend.append("files", formData.content); // Assuming backend expects 'files' for multimedia files
        }
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category); // Send category ID or name
        formData.tags.forEach(tag => {
          formDataToSend.append("tags[]", tag); // Assuming backend expects 'tags[]' for array
        });
        formDataToSend.append("type", formData.contentType);
        // If editing, include content ID
        if (editContent) {
          formDataToSend.append("id", editContent.id); // ID is string
          // Include IDs of associated multimedia to keep
          formData.associatedMultimedia.forEach(media => {
            formDataToSend.append("existingMultimediaIds[]", media.id);
          });
        }
        body = formDataToSend;
      }

      if (method === "PUT") {
        // TODO: Verificar el payload y el endpoint de actualización de content
        await api.put(url, body as unknown)
          .then(() => {
            toast.success("Contenido actualizado!", {
              description: "El contenido se ha actualizado correctamente.",
            });
            // After successfully updating, refetch the list of contents using the hook's refetch function
            refetch();
          })
          .catch((error: unknown) => {
            toast.error("Error!", {
              description: "Hubo un error al actualizar el contenido.",
            });
            console.error("Error al actualizar el contenido:", error);
          });
      } else { // POST for creation
        // TODO: Verificar el payload y el endpoint de creación de content
        await api.post(url, body as unknown)
          .then(() => {
            toast.success("Contenido guardado!", {
              description: "El contenido se ha guardado correctamente.",
            });
            // After successfully creating a new content, refetch the updated list of contents using the hook's refetch function
            refetch();
          })
          .catch((error: unknown) => {
            toast.error("Error!", {
              description: "Hubo un error al obtener los contenidos actualizados.",
            });
            console.error("Error al obtener los contenidos actualizados:", error);
          });
      }

      setShowForm(false);
      setEditContent(null);
      // Reset form data on success
      setFormData({
        title: "",
        description: "",
        category: "",
        contentType: "",
        tags: [],
        tagInput: "",
        content: null,
        associatedMultimedia: [],
        contentError: "",
      });
      setErrors({}); // Clear errors on success
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar contenido.";
      const action = editContent ? "actualizar" : "guardar";
      toast.error(`Error al ${action} el contenido: ${errorMessage}`);
      console.error("Error al guardar el contenido:", error);
    } finally {
      setIsLoadingSave(false); // Reset loading state for save
    }
  };

  const handleDelete = async (id: string) => { // Cambiado a string
    setIsLoadingDelete(true); // Set loading state for delete
    try {
      // TODO: Verificar el endpoint de eliminación de content
      await api.delete(`/content/${id}`); // Usar endpoint /content (singular)

      toast.success("Contenido eliminado!", {
        description: "El contenido se ha eliminado correctamente.",
      });

      // After successfully deleting, refetch the list of contents using the hook's refetch function
      refetch();
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
      // TODO: Verificar el endpoint de eliminación de multimedia
      await api.delete(`/multimedia/${multimediaId}`); // Assuming DELETE /multimedia/:id endpoint

      toast.success("Archivo multimedia eliminado!", {
        description: "El archivo multimedia se ha eliminado correctamente.",
      });

      // Remove the deleted multimedia item from the associatedMultimedia state
      updateFormData({ associatedMultimedia: formData.associatedMultimedia.filter(media => media.id !== multimediaId) });

      // Optionally, refetch contents to ensure the table is updated
      // TODO: Verificar la estructura exacta de la respuesta de /content
      // Removed refetching contents here as it's handled after saving/deleting content
      // api.get("/content") // Usar endpoint /content (singular)
      //   .then((data: ContentItem[]) => {
      //     setContents(data);
      //   })
      //   .catch((error: unknown) => {
      //     toast.error("Error!", {
      //       description: "Hubo un error al obtener los contenidos actualizados después de eliminar multimedia.",
      //     });
      //     console.error("Error fetching updated contents after deleting multimedia:", error);
      //   });

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
    setFormData({
      title: content.title,
      description: content.description,
      category: content.category, // Assuming content.category is the ID or name
      contentType: content.type,
      tags: content.tags,
      tagInput: "", // Reset tag input
      content: content.type === "texto" ? content.content : null,
      associatedMultimedia: content.multimediaItems || [], // Set associated multimedia
      contentError: "", // Clear content error
    });
    setErrors({}); // Clear errors when editing
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      updateFormData({ tags: [...formData.tags, formData.tagInput.trim()], tagInput: "" });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateFormData({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };


  return (
    <div>
      <h2>Gestión de Contenidos</h2>
      <Button
        onClick={() => {
          setShowForm(!showForm);
          setEditContent(null);
          // Reset form data when creating new content
          setFormData({
            title: "",
            description: "",
            category: "",
            contentType: "",
            tags: [],
            tagInput: "",
            content: null,
            associatedMultimedia: [],
            contentError: "",
          });
          setErrors({}); // Clear errors when creating new
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
            // Reset form data on cancel
            setFormData({
              title: "",
              description: "",
              category: "",
              contentType: "",
              tags: [],
              tagInput: "",
              content: null,
              associatedMultimedia: [],
              contentError: "",
            });
            setErrors({}); // Clear errors on cancel
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Use grid for layout */}
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title" // Add name attribute
                value={formData.title}
                onChange={(e) => {
                  updateFormData({ title: e.target.value });
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
                value={formData.category}
                onValueChange={(value) => {
                  updateFormData({ category: value });
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
                    <SelectItem key={cat.id} value={cat.id}> {/* Assuming category value should be ID */}
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
              value={formData.description}
              onChange={(e) => {
                updateFormData({ description: e.target.value });
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
            <Label htmlFor="contentType">Tipo de Contenido</Label>
            <Select
              value={formData.contentType}
              onValueChange={(value) => {
                updateFormData({ contentType: value, content: null, associatedMultimedia: [], contentError: "" }); // Clear content and multimedia when type changes
                setErrors({}); // Clear errors on change
              }}
              disabled={isLoadingSave || !!editContent} // Disable select while saving or editing
              aria-invalid={!!contentTypeError} // Add aria-invalid
              aria-describedby={contentTypeError ? "content-type-error" : undefined} // Add aria-describedby
            >
              <SelectTrigger id="contentType" className={contentTypeError ? "border-red-500" : ""}> {/* Add red border on error */}
                <SelectValue placeholder="Seleccione un tipo" />
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
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="tagInput"
                value={formData.tagInput}
                onChange={(e) => updateFormData({ tagInput: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    handleAddTag();
                  }
                }}
                placeholder="Agregar tag (presiona Enter)"
                disabled={isLoadingSave} // Disable input while saving
              />
              <Button onClick={handleAddTag} type="button" disabled={isLoadingSave}>Agregar</Button> {/* Add type="button" */}
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {tag}
                  <button
                    type="button" // Add type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-600 hover:text-gray-900 focus:outline-none"
                    disabled={isLoadingSave} // Disable button while saving
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Content Input based on contentType */}
          {formData.contentType === "texto" ? (
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <ReactQuill
                theme="snow"
                value={formData.content as string} // Cast to string for ReactQuill
                onChange={(value) => {
                  updateFormData({ content: value, contentError: "" }); // Clear content error on change
                }}
                readOnly={isLoadingSave} // Disable editor while saving
              />
              {formData.contentError && <p className="text-red-500 text-sm">{formData.contentError}</p>} {/* Display content error */}
            </div>
          ) : formData.contentType === "imagen" ||
            formData.contentType === "video" ||
            formData.contentType === "audio" ? (
            <div className="grid gap-2">
              <Label htmlFor="file">Archivo</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    // Handle multiple files if needed, for now assume single file
                    updateFormData({ content: e.target.files[0], contentError: "" }); // Clear content error on change
                  }
                }}
                disabled={isLoadingSave} // Disable input while saving
                aria-invalid={!!formData.contentError} // Add aria-invalid
                aria-describedby={formData.contentError ? "content-file-error" : undefined} // Add aria-describedby
                className={formData.contentError ? "border-red-500" : ""} // Add red border on error
              />
              {formData.contentError && <p id="content-file-error" className="text-red-500 text-sm">{formData.contentError}</p>} {/* Display content error */}
              {/* Display associated multimedia when editing */}
              {editContent && formData.associatedMultimedia.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Archivos Multimedia Asociados:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.associatedMultimedia.map(media => (
                      <div key={media.id} className="relative border rounded p-2">
                        <MultimediaPlayer url={media.url} type={media.type} />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => handleDeleteMultimedia(media.id)}
                          disabled={isLoadingSave || isLoadingDelete} // Disable button while saving or deleting
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </Form>
      )}
      <div className="overflow-x-auto"> {/* Add overflow-x-auto for responsive tables */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Cargando contenidos...</TableCell>
              </TableRow>
            ) : contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No hay contenidos disponibles.</TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.title}</TableCell>
                  <TableCell>{content.description}</TableCell>
                  <TableCell>{categories.find(cat => cat.id === content.category)?.name || content.category}</TableCell> {/* Display category name */}
                  <TableCell>{content.type}</TableCell>
                  <TableCell>{content.tags.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(content)}
                      disabled={isLoadingSave || isLoadingDelete} // Disable button while saving or deleting
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(content.id)}
                      disabled={isLoadingSave || isLoadingDelete} // Disable button while saving or deleting
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentManager;
