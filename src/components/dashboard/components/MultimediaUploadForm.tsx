import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }

    setUploading(true);
    setMessage("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("multimedia", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    try {
      const response = await api.put("/multimedia/upload", formData, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setMessage("Archivo subido con éxito: " + response.url);
      setSelectedFile(null);
      setUploadProgress(0);
      setTitle("");
      setDescription("");
      setTags("");
    } catch (error: unknown) {
      setMessage("Error de red o del servidor: " + (error as Error).message);
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
          style={{ width: "200px" }}
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
    <div className="multimedia-upload-form">
      <h3>Subir Archivo Multimedia</h3>
      <div>
        <Label htmlFor="fileType" id="fileType">Tipos de archivo permitidos</Label>
        <Select
          onValueChange={handleTypeChange}
          defaultValue={selectedTypes[0]}
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
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="tags">Etiquetas</Label>
        <Input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta el archivo aquí ...</p>
        ) : (
          <p>Arrastra y suelta el archivo aquí, o haz clic para seleccionar un archivo</p>
        )}
      </div>
      {selectedFile && (
        <div>
          <p>Archivo seleccionado: {selectedFile.name}</p>
          {preview}
        </div>
      )}
      {uploadProgress > 0 && <Progress value={uploadProgress} />}
      <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Subiendo..." : "Subir"}
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MultimediaUploadForm;
