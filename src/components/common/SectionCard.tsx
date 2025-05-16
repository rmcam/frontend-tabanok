import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  description: string;
  link: string;
  date?: string;
  location?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, link, date, location }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
        {date && <p>Fecha: {date}</p>}
        {location && <p>Lugar: {location}</p>}
      </CardContent>
      <CardFooter>
        <a href={link} className="text-blue-500 hover:underline">
          Ver más
        </a>
      </CardFooter>
    </Card>
  );
};

export default SectionCard;