
import React from 'react';
import eventsData from '../eventsData';
import SectionCard from '@/components/common/SectionCard';

const EventsSection = () => {
  return (
    <section className="py-6 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Eventos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventsData.map((event) => (
          <SectionCard
            key={event.id}
            title={event.title}
            description={event.description}
            link={event.link}
            date={event.date}
            location={event.location}
          />
        ))}
      </div>
    </section>
  );
};

export default EventsSection;