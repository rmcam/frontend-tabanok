import React from 'react';
import UnitCard from './components/UnitCard';
import Section from '@/components/common/Section';

interface Unit {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  lessonsCount: number;
  progress: number;
}

const UnitListPage: React.FC = () => {
  const units: Unit[] = [
    {
      id: 1,
      title: 'Unidad 1: Introducción',
      description: 'Una breve introducción al tema.',
      imageUrl: 'https://via.placeholder.com/150', // Placeholder image
      lessonsCount: 5,
      progress: 20,
    },
    {
      id: 2,
      title: 'Unidad 2: Conceptos básicos',
      description: 'Explorando los conceptos básicos del tema.',
      imageUrl: 'https://via.placeholder.com/150', // Placeholder image
      lessonsCount: 8,
      progress: 50,
    },
    {
      id: 3,
      title: 'Unidad 3: Aplicaciones prácticas',
      description: 'Aplicando los conceptos a situaciones prácticas.',
      imageUrl: 'https://via.placeholder.com/150', // Placeholder image
      lessonsCount: 12,
      progress: 80,
    },
  ];

  return (
    <Section className="unit-list mb-4" title="Lista de Unidades">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unitId={unit.id.toString()}
            title={unit.title}
            description={unit.description}
            imageUrl={unit.imageUrl}
            lessonsCount={unit.lessonsCount}
            progress={unit.progress}
          />
        ))}
      </div>
    </Section>
  );
};

export default UnitListPage;