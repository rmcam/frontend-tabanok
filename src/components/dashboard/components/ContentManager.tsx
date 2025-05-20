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
  Textarea,
} from "@/components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/auth/hooks/useAuth";
import { toast } from "sonner";
import api from "@/lib/api";
// import AdminRoute from "@/components/common/AdminRoute";
import { MultimediaMetadata } from "@/types/multimediaTypes";
import { ContentType } from "@/types/activityTypes";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MultimediaPlayer from "../../common/MultimediaPlayer";
import useFormValidation from "@/hooks/useFormValidation";
import useFetchContentData from "@/hooks/useFetchContentData";
import { XCircle } from "lucide-react"; // Import XCircle icon
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

interface MultimediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  url: string;
  lessonId: string;
  metadata: MultimediaMetadata;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  type: ContentType;
  content: string | null;
  multimediaItems?: MultimediaItem[];
}

export interface Category {
  id: string;
  name: string;
}

interface ContentFormData {
  title: string;
  description: string;
  category: string;
  contentType: string;
  tags: string[];
  tagInput: string;
  content: string | File[] | File | null;
  associatedMultimedia: MultimediaItem[];
  contentError: string;
}

interface ContentFormValidationValues {
  title: string;
  description: string;
  category: string;
  contentType: string;
}

const ContentManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editContent, setEditContent] = useState<ContentItem | null>(null);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // State for API errors

  const { categories, refetch, loading: isLoadingCategories, error: categoriesError } = useFetchContentData(); // Get loading and error from hook

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

  const updateFormData = useCallback((updates: Partial<ContentFormData>) => {
    setFormData(prevData => ({ ...prevData, ...updates }));
  }, []);

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
  } = useFormValidation<ContentFormValidationValues>(initialFormValidationValues);

  const { title: titleError, description: descriptionError, category: categoryError, contentType: contentTypeError } = errors;

  useEffect(() => {
    if (editContent) {
      setFormData({
        title: editContent.title,
        description: editContent.description,
        category: editContent.category,
        contentType: editContent.type,
        tags: editContent.tags,
        tagInput: "",
        content: editContent.type === "text" ? editContent.content : null,
        associatedMultimedia: editContent.multimediaItems || [],
        contentError: "",
      });
      setErrors({});
    } else {
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
      setErrors({});
    }
  }, [editContent, setErrors]);

  const handleSave = async () => {
    const formValidationResult = handleSubmit(validationRules)({
      preventDefault: () => { },
      currentTarget: { elements: {} }
    } as unknown as React.FormEvent);

    let isContentValid = true;
    updateFormData({ contentError: "" });
    setApiError(null); // Clear previous API errors

    if (formData.contentType === "text" && (!formData.content || (typeof formData.content === 'string' && !formData.content.trim()))) {
      updateFormData({ contentError: "El contenido es obligatorio." });
      isContentValid = false;
    }

    if (
      (formData.contentType === "image" ||
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

    setIsLoadingSave(true);

    try {
      const contentData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        type: formData.contentType,
        content: formData.contentType === "text" ? (formData.content as string | null) : null,
      };

      const method = editContent ? "PUT" : "POST";
      const url = editContent ? `/content/${editContent.id}` : `/content`;

      let body;
      if (formData.contentType === "text") {
        body = JSON.stringify(contentData);
      } else {
        const formDataToSend = new FormData();
        if (Array.isArray(formData.content)) {
          formData.content.forEach((file) => {
            formDataToSend.append("files", file);
          });
        } else if (formData.content instanceof File) {
          formDataToSend.append("files", formData.content);
        }
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category);
        formData.tags.forEach(tag => {
          formDataToSend.append("tags[]", tag);
        });
        formDataToSend.append("type", formData.contentType);
        if (editContent) {
          formDataToSend.append("id", editContent.id);
          formData.associatedMultimedia.forEach(media => {
            formDataToSend.append("existingMultimediaIds[]", media.id);
          });
        }
        body = formDataToSend;
      }

      if (method === "PUT") {
        await api.put(url, body as unknown)
          .then(() => {
            toast.success("Contenido actualizado!", {
              description: "El contenido se ha actualizado correctamente.",
            });
            refetch();
          })
          .catch((error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar el contenido.";
            setApiError(`Error al actualizar el contenido: ${errorMessage}`); // Set API error state
            toast.error("Error!", {
              description: `Hubo un error al actualizar el contenido: ${errorMessage}`,
            });
            console.error("Error al actualizar el contenido:", error);
          });
      } else {
        await api.post(url, body as unknown)
          .then(() => {
            toast.success("Contenido guardado!", {
              description: "El contenido se ha guardado correctamente.",
            });
            refetch();
          })
          .catch((error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar el contenido.";
            setApiError(`Error al guardar el contenido: ${errorMessage}`); // Set API error state
            toast.error("Error!", {
              description: `Hubo un error al guardar el contenido: ${errorMessage}`,
            });
            console.error("Error al guardar el contenido:", error);
          });
      }

      setShowForm(false);
      setEditContent(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: [],
        tagInput: "",
        content: null,
        associatedMultimedia: [],
        contentError: "",
        contentType: ""
      });
      setErrors({});
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar contenido.";
      const action = editContent ? "actualizar" : "guardar" ;
      setApiError(`Error al ${action} el contenido: ${errorMessage}`); // Set API error state
      toast.error(`Error al ${action} el contenido: ${errorMessage}`);
      console.error("Error al guardar el contenido:", error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (content: ContentItem) => {
    setEditContent(content);
    setShowForm(true);
    setFormData({
      title: content.title,
      description: content.description,
      category: content.category,
      contentType: content.type,
      tags: content.tags,
      tagInput: "",
      content: content.type === "text" ? content.content : null,
      associatedMultimedia: content.multimediaItems || [],
      contentError: "",
    });
    setErrors({});
    setApiError(null); // Clear API errors when opening edit form
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      updateFormData({ tags: [...formData.tags, formData.tagInput.trim()], tagInput: "" });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateFormData({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este contenido?")) {
      setIsLoadingDelete(true);
      setApiError(null); // Clear previous API errors
      try {
        if (!user?.roles.includes("admin")) {
          toast.error("No tienes permisos para eliminar este contenido.");
          return;
        }
        await api.delete(`/content/${id}`);

        toast.success("Contenido eliminado!", {
          description: "El contenido se ha eliminado correctamente.",
        });

        refetch();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar el contenido.";
        setApiError(`Error al eliminar el contenido: ${errorMessage}`); // Set API error state
        toast.error("Error!", {
          description: `Hubo un error al eliminar el contenido: ${errorMessage}`,
        });
        console.error("Error al eliminar el contenido:", error);
      } finally {
        setIsLoadingDelete(false);
      }
    }
  };

  const handleDeleteMultimedia = async (multimediaId: string) => {
    setIsLoadingDelete(true); // Use isLoadingDelete for multimedia deletion as well
    setApiError(null); // Clear previous API errors
    try {
      await api.delete(`/multimedia/${multimediaId}`);

      toast.success("Archivo multimedia eliminado!", {
        description: "El archivo multimedia se ha eliminado correctamente.",
      });

      updateFormData({ associatedMultimedia: formData.associatedMultimedia.filter(media => media.id !== multimediaId) });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar el archivo multimedia.";
      setApiError(`Error al eliminar el archivo multimedia: ${errorMessage}`); // Set API error state
        toast.error("Error!", {
          description: `Hubo un error al eliminar el archivo multimedia: ${errorMessage}`,
        });
      console.error("Error al eliminar el archivo multimedia:", error);
    } finally {
      setIsLoadingDelete(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Gestión de Contenidos</h2>
      <Button
        onClick={() => {
          setShowForm(!showForm);
          setEditContent(null);
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
          setErrors({});
          setApiError(null); // Clear API errors when opening new form
        }}
      >
        Crear Nuevo Contenido
      </Button>

      {isLoadingCategories && (
        <div className="mt-4">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {categoriesError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error al cargar categorías</AlertTitle>
          <AlertDescription>{categoriesError}</AlertDescription>
        </Alert>
      )}

      {(showForm || editContent) && (
        <Form
          title={editContent ? "Editar Contenido" : "Crear Nuevo Contenido"}
          description="Ingrese la información del nuevo contenido."
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditContent(null);
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
            setErrors({});
            setApiError(null); // Clear API errors when canceling form
          }}
        >
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="general-info">
              <AccordionTrigger contentId="general-info-content">Información General</AccordionTrigger>
              <AccordionContent id="general-info-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => {
                        updateFormData({ title: e.target.value });
                        setErrors({});
                      }}
                      disabled={isLoadingSave}
                      aria-invalid={!!titleError}
                      aria-describedby={titleError ? "content-title-error" : undefined}
                      className={titleError ? "border-red-500" : ""}
                    />
                    {titleError && <p id="content-title-error" className="text-red-500 text-sm">{titleError}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        updateFormData({ category: value });
                        setErrors({});
                      }}
                      disabled={isLoadingSave || isLoadingCategories} // Disable if categories are loading
                      aria-invalid={!!categoryError}
                      aria-describedby={categoryError ? "content-category-error" : undefined}
                    >
                      <SelectTrigger id="category" className={categoryError ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categoryError && <p id="content-category-error" className="text-red-500 text-sm">{categoryError}</p>}
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => {
                      updateFormData({ description: e.target.value });
                      setErrors({});
                    }}
                    disabled={isLoadingSave}
                    aria-invalid={!!descriptionError}
                    aria-describedby={descriptionError ? "content-description-error" : undefined}
                    className={descriptionError ? "border-red-500" : ""}
                  />
                  {descriptionError && <p id="content-description-error" className="text-red-500 text-sm">{descriptionError}</p>}
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="contentType">Tipo de Contenido</Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(value) => {
                      updateFormData({ contentType: value, content: null, associatedMultimedia: [], contentError: "" });
                      setErrors({});
                    }}
                    disabled={isLoadingSave || !!editContent}
                    aria-invalid={!!contentTypeError}
                    aria-describedby={contentTypeError ? "content-type-error" : undefined}
                  >
                    <SelectTrigger id="contentType" className={contentTypeError ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                  {contentTypeError && <p id="content-type-error" className="text-red-500 text-sm">{contentTypeError}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content-file">
              <AccordionTrigger contentId="content-file-content">Contenido / Archivo</AccordionTrigger>
              <AccordionContent id="content-file-content">
                {formData.contentType === "text" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="content">Contenido</Label>
                    <ReactQuill
                      aria-label="Editor de texto enriquecido"
                      theme="snow"
                      value={formData.content as string}
                      onChange={(value) => {
                        updateFormData({ content: value, contentError: "" });
                      }}
                      readOnly={isLoadingSave}
                    />
                    {formData.contentError && <p className="text-red-500 text-sm">{formData.contentError}</p>}
                  </div>
                ) : formData.contentType === "image" ||
                  formData.contentType === "video" ||
                  formData.contentType === "audio" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="file">Archivo</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          updateFormData({ content: e.target.files[0], contentError: "" });
                        }
                      }}
                      disabled={isLoadingSave}
                      aria-invalid={!!formData.contentError}
                      aria-describedby={formData.contentError ? "content-file-error" : undefined}
                      className={formData.contentError ? "border-red-500" : ""}
                    />
                    {formData.contentError && <p id="content-file-error" className="text-red-500 text-sm">{formData.contentError}</p>}
                  </div>
                ) : (
                  <p className="text-gray-500">Seleccione un tipo de contenido para agregar el contenido o archivo.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tags">
              <AccordionTrigger contentId="tags-content">Tags</AccordionTrigger>
              <AccordionContent id="tags-content">
                <div className="grid gap-2">
                  <Label htmlFor="tagInput">Tags</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="tagInput"
                      value={formData.tagInput}
                      onChange={(e) => updateFormData({ tagInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Agregar tag (presiona Enter)"
                      disabled={isLoadingSave}
                    />
                    <Button onClick={handleAddTag} type="button" disabled={isLoadingSave}>Agregar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:hover:bg-blue-600 dark:hover:text-white"
                          aria-label={`Remove tag ${tag}`}
                          disabled={isLoadingSave}
                        >
                          <XCircle size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {editContent && formData.associatedMultimedia.length > 0 && (
              <AccordionItem value="associated-multimedia">
                <AccordionTrigger contentId="associated-multimedia-content">Archivos Multimedia Asociados</AccordionTrigger>
                <AccordionContent id="associated-multimedia-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.associatedMultimedia.map(media => (
                      <div key={media.id} className="relative border rounded p-2">
                        <MultimediaPlayer url={media.url} type={media.type} />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => handleDeleteMultimedia(media.id)}
                          disabled={isLoadingSave || isLoadingDelete}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </Form>
      )}
    </div>
  );
}

export default ContentManager;
