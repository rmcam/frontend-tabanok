import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa tus archivos de traducción aquí
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json'; // Importar traducción en español
import translationKMT from './locales/kmt/translation.json'; // Importar traducción en kamentsa

// Los recursos de traducción
const resources = {
  en: {
    translation: translationEN,
  },
  es: { // Añadir recursos en español
    translation: translationES,
  },
  kmt: { // Añadir recursos en kamentsa
    translation: translationKMT,
  },
};

i18n
  .use(initReactI18next) // Pasa i18n a react-i18next.
  .init({
    resources,
    lng: 'es', // Idioma por defecto (cambiado a español)
    fallbackLng: 'en', // Idioma de fallback
    interpolation: {
      escapeValue: false, // react ya escapa los valores
    },
  });

export default i18n;
