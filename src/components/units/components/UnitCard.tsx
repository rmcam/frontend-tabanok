import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from 'react-router-dom';

interface UnitCardProps {
  title: string;
  description: string;
  imageUrl: string;
  lessonsCount: number;
  progress: number;
  unitId: string;
}

const UnitCard: React.FC<UnitCardProps> = ({ title, description, imageUrl, lessonsCount, progress, unitId }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowFullDescription(!showFullDescription);
  };

  return (
    <Link to={`/units/${unitId}`} className="h-full">
      <Card className="unit-card shadow-sm h-full">
        <AspectRatio ratio={16 / 9}>
          <img src={imageUrl} alt={title} className="card-image" style={{ objectFit: "cover" }} />
        </AspectRatio>
        <CardContent className="flex flex-col justify-start h-full">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {showFullDescription ? description : `${description.substring(0, 100)}...`}
            {description.length > 100 && (
              <button
                onClick={toggleDescription}
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {showFullDescription ? "Ver menos" : "Ver más"}
              </button>
            )}
          </CardDescription>
          <CardDescription>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 inline-block mr-1"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            Lecciones: {lessonsCount}
          </CardDescription>
          <CardDescription>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 inline-block mr-1"
            >
              <path
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3c0 .859.597 1.553 1.347 1.687 .232.042.485.002.684-.118l.353-.25c.445-.318 1.081-.318 1.526 0l.353.25c.199.14.452.178.684.118A1.5 1.5 0 0117.25 9.75v-3A5.25 5.25 0 0012 1.5zM8.25 9.75a3.75 3.75 0 017.5 0v4.5h3A2.25 2.25 0 0021 16.5v-3A7.5 7.5 0 006 6.75v3a2.25 2.25 0 002.25 2.25h0zM4.5 18a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"
              />
            </svg>
            Progreso: {progress}%
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UnitCard;