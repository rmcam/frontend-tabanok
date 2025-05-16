import React from 'react';
import resourcesData from '../resourcesData';
import SectionCard from '@/components/common/SectionCard';
const ResourcesSection = () => {
  return (
    <section className="py-6 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Recursos Adicionales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resourcesData.map((resource) => (
          <SectionCard
            key={resource.id}
            title={resource.title}
            description={resource.description}
            link={resource.link}
          />
        ))}
      </div>
    </section>
  );
};

export default ResourcesSection;