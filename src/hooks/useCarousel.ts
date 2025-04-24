import { useState } from 'react';

export const useCarousel = (initialSlide: number, totalSlides: number) => {
  const [slide, setSlide] = useState(initialSlide);

  const nextSlide = () => {
    setSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  return {
    slide,
    setSlide,
    nextSlide,
    prevSlide,
  };
};
