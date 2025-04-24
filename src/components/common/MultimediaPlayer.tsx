import React from 'react';

interface MultimediaPlayerProps {
  type: 'video' | 'audio' | 'image';
  url: string;
  title?: string;
}

const MultimediaPlayer: React.FC<MultimediaPlayerProps> = ({ type, url, title }) => {
  switch (type) {
    case 'video':
      return (
        <div className="multimedia-player video-player">
          <video controls width="100%">
            <source src={url} type="video/mp4" /> {/* Asumimos mp4 por ahora */}
            Tu navegador no soporta la etiqueta de video.
          </video>
          {title && <p className="multimedia-title">{title}</p>}
        </div>
      );
    case 'audio':
      return (
        <div className="multimedia-player audio-player">
          <audio controls>
            <source src={url} type="audio/mpeg" /> {/* Asumimos mpeg por ahora */}
            Tu navegador no soporta la etiqueta de audio.
          </audio>
          {title && <p className="multimedia-title">{title}</p>}
        </div>
      );
    case 'image':
      return (
        <div className="multimedia-player image-player">
          <img src={url} alt={title || 'Imagen multimedia'} style={{ maxWidth: '100%', height: 'auto' }} />
          {title && <p className="multimedia-title">{title}</p>}
        </div>
      );
    default:
      return <div>Tipo de multimedia no soportado.</div>;
  }
};

export default MultimediaPlayer;
