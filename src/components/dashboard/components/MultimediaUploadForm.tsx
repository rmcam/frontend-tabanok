import React, { useState } from "react";
import api from '@/lib/api';

const MultimediaUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setSelectedFile(null);
        setMessage("Por favor, selecciona un archivo válido (png, jpg, jpeg, gif, mp3, wav, mp4, webm).");
        return;
      }
      setSelectedFile(file);
      setMessage("");
    } else {
      setSelectedFile(null);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("multimedia", selectedFile); // 'multimedia' es el nombre esperado por el backend

    try {
      const response = await api.put('/multimedia/upload', formData);

      setMessage("Archivo subido con éxito: " + response.url);
      setSelectedFile(null); // Limpiar la selección después de subir
    } catch (error: unknown) {
      setMessage("Error de red o del servidor: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="multimedia-upload-form">
      <h3>Subir Archivo Multimedia</h3>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? "Subiendo..." : "Subir"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MultimediaUploadForm;
