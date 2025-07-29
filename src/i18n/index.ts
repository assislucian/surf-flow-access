import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './translations/de.json';
import en from './translations/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: de
      },
      en: {
        translation: en
      }
    },
    lng: 'de', // default language
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;