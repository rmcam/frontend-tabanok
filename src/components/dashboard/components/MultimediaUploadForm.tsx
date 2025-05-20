import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const allowedTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "audio/mpeg",
  "audio/wav",
  "video/mp4",
  "video/webm",
];

const MultimediaUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(allowedTypes);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [fileError, setFileError] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileError("");
      const file = acceptedFiles[0];
      if (!selectedTypes.includes(file.type)) {
        setSelectedFile(null);
        setMessage("Por favor, selecciona un archivo válido.");
        return;
      }
      setSelectedFile(file);
      setMessage("");
    },
    [selectedTypes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const validateForm = () => {
    let isValid = true;
    setTitleError("");
    setDescriptionError("");
    setTagsError("");
    setFileError("");

    if (!selectedFile) {
      setFileError("Por favor, selecciona un archivo.");
      isValid = false;
    }

    if (!title.trim()) {
      setTitleError("El título es obligatorio.");
      isValid = false;
    }

    // Add validation for description and tags if needed (based on project requirements)
    // For now, assuming they are optional or have basic validation

    return isValid;
  };

  const handleUpload = async () => {
    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setMessage("");
    setUploadProgress(0);
    setApiError(null);

    const formData = new FormData();
    formData.append("multimedia", selectedFile!);
    formData.append("title", title);
    formData.append("description", description);

    // Split tags string into an array and append each tag
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    tagsArray.forEach(tag => {
      formData.append("tags[]", tag); // Assuming backend expects 'tags[]' for array
    });

    try {
      // TODO: Verificar la estructura exacta del payload esperado por el backend para POST /multimedia/upload
      const response = await api.post("/multimedia/upload", formData, { // Cambiado de PUT a POST
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setMessage("Archivo subido con éxito: " + response.url); // Keep success message
      setSelectedFile(null);
      setUploadProgress(0);
      setTitle("");
      setDescription("");
      setTags("");
      setTitleError(""); // Clear errors on success
      setDescriptionError("");
      setTagsError("");
      setFileError("");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al subir el archivo.";
      setMessage(`Error al subir el archivo: ${errorMessage}`); // Keep error message
      setApiError(errorMessage);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  let preview = null;
  if (selectedFile) {
    if (selectedFile.type.startsWith("image")) {
      preview = (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="w-full max-w-xs h-auto sm:max-w-sm md:max-w-md lg:max-w-lg" // Usar clases responsive de Tailwind
        />
      );
    } else if (selectedFile.type.startsWith("video")) {
      preview = (
        <video src={URL.createObjectURL(selectedFile)} width="200" controls />
      );
    } else if (selectedFile.type.startsWith("audio")) {
      preview = (
        <audio src={URL.createObjectURL(selectedFile)} controls />
      );
    }
  }

  const handleTypeChange = (value: string) => {
    setSelectedTypes([value]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subir Archivo Multimedia</CardTitle>
        <CardDescription>Seleccione un archivo y complete los detalles.</CardDescription>
      </CardHeader>
      <CardContent>
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        <div className="mb-4">
          <Label htmlFor="fileType">Tipos de archivo permitidos</Label>
          <Select
            onValueChange={handleTypeChange}
            defaultValue={selectedTypes[0]}
            disabled={uploading}
            >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione los tipos de archivo" />
            </SelectTrigger>
            <SelectContent>
              {allowedTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2">
          <Label htmlFor="title" className="w-full mb-2">Título</Label>
          <Input
            type="text"
            id="title"
            className="w-full mb-4"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            disabled={uploading}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? "multimedia-title-error" : undefined}
          />
          {titleError && <p id="multimedia-title-error" className="text-red-500 text-sm">{titleError}</p>}
        </div>
        <div className="mb-4">
          <Label htmlFor="description" className="w-full mb-2">Descripción</Label>
          <Textarea
            id="description"
            className="w-full mb-4"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionError("");
            }}
            disabled={uploading}
            aria-invalid={!!descriptionError}
            aria-describedby={descriptionError ? "multimedia-description-error" : undefined}
          />
          {descriptionError && <p id="multimedia-description-error" className="text-red-500 text-sm">{descriptionError}</p>}
        </div>
        <div className="mb-4">
          <Label htmlFor="tags" className="w-full mb-2">Etiquetas</Label>
          <Input
            type="text"
            id="tags"
            className="w-full mb-4"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              setTagsError("");
            }}
            disabled={uploading}
            aria-invalid={!!tagsError}
            aria-describedby={tagsError ? "multimedia-tags-error" : undefined}
          />
          {tagsError && <p id="multimedia-tags-error" className="text-red-500 text-sm">{tagsError}</p>}
        </div>
        <div {...getRootProps()} className={`dropzone ${uploading ? 'disabled' : ''} border-2 border-dashed rounded-md p-4 text-center`}>
          <input {...getInputProps()} disabled={uploading} />
          {isDragActive && !uploading ? (
            <p>Suelta el archivo aquí ...</p>
          ) : !uploading ? (
            <p>Arrastra y suelta el archivo aquí, o haz clic para seleccionar un archivo</p>
          ) : (
            <p>Subiendo archivo...</p>
          )}
        </div>
        {fileError && <p id="multimedia-file-error" className="text-red-500 text-sm">{fileError}</p>}
        {selectedFile && (
          <div className="mt-4">
            <p>Archivo seleccionado: {selectedFile.name}</p>
            {preview}
          </div>
        )}
        {uploadProgress > 0 && <Progress value={uploadProgress} className="mb-4" />}
        <Button onClick={handleUpload} disabled={!selectedFile || uploading}
        >
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-label="Subiendo" /> : null}
          Subir
        </Button>
        {message && <p className="mt-4">{message}</p>}
      </CardContent>
    </Card>
  );
};

export default MultimediaUploadForm;
