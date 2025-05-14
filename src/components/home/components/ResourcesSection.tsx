import React from 'react';

import resourcesData from '../resourcesData';

const ResourcesSection = () => {
  return (
    <section className="py-6 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Recursos Adicionales</h2>
      <ul>
        {resourcesData.map((resource) => (
          <li key={resource.id}>
            <a href={resource.link}>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResourcesSection;