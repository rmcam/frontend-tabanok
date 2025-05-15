import React from 'react';
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
  return (
    <Link to={`/units/${unitId}`}>
      <Card className="unit-card shadow-sm">
        <AspectRatio ratio={16 / 9}>
          <img src={imageUrl} alt={title} className="card-image" style={{objectFit: "cover"}} />
        </AspectRatio>
        <CardContent>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardDescription>Lecciones: {lessonsCount}</CardDescription>
          <CardDescription>Progreso: {progress}%</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UnitCard;