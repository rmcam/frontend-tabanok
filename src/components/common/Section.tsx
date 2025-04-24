import React from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, description, children, className }) => {
  return (
    <section className={className}>
      <h2 className="text-3xl font-semibold mb-4 text-center">{title}</h2>
      {description && <p className="text-lg mb-8 text-center">{description}</p>}
      {children}
    </section>
  );
};

export default Section;
