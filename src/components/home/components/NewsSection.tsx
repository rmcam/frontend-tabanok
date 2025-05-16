
import React from 'react';
import newsData from '../newsData';
import SectionCard from '@/components/common/SectionCard';

const NewsSection = () => {
  return (
    <section className="py-6 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Noticias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsData.map((news) => (
          <SectionCard
            key={news.id}
            title={news.title}
            description={news.description}
            link={news.link}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;