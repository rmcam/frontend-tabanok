import React, { useState } from 'react';

const MultimediaUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage('');
    } else {
      setSelectedFile(null);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('multimedia', selectedFile); // 'multimedia' es el nombre esperado por el backend

    try {
      const response = await fetch('/multimedia/upload', {
        method: 'POST',
        body: formData,
        // No Content-Type header needed for FormData
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Archivo subido con éxito: ' + result.url);
        setSelectedFile(null); // Limpiar la selección después de subir
      } else {
        try {
          const errorJson = await response.json();
          setMessage('Error al subir el archivo: ' + errorJson.message);
        } catch {
          const errorText = await response.text();
          setMessage('Error al subir el archivo: ' + errorText);
        }
      }
    } catch (error) {
      setMessage('Error de red o del servidor: ' + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="multimedia-upload-form">
      <h3>Subir Archivo Multimedia</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? 'Subiendo...' : 'Subir'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MultimediaUploadForm;
