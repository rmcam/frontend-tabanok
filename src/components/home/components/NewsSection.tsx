
import React from 'react';
import newsData from '../newsData';

const NewsSection = () => {
  return (
    <section className="py-6 sm:py-10">
      <h2 className="text-2xl font-bold text-center mb-4">Noticias</h2>
      <ul>
        {newsData.map((news) => (
          <li key={news.id}>
            <a href={news.link}>
              <h3>{news.title}</h3>
              <p>{news.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsSection;