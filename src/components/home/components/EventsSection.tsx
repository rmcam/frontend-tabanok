
import React from 'react';
import eventsData from '../eventsData';

const EventsSection = () => {
  return (
    <section className="py-6 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Eventos</h2>
      <ul>
        {eventsData.map((event) => (
          <li key={event.id}>
            <a href={event.link}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{event.date}</p>
              <p>{event.location}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EventsSection;