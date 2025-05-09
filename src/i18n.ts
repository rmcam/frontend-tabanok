import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa tus archivos de traducción aquí
import translationEN from './locales/en/translation.json';

// Los recursos de traducción
const resources = {
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next) // Pasa i18n a react-i18next.
  .init({
    resources,
    lng: 'en', // Idioma por defecto
    fallbackLng: 'en', // Idioma de fallback
    interpolation: {
      escapeValue: false, // react ya escapa los valores
    },
  });

export default i18n;
