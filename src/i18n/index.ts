import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import namespaced translations
import deCommon from './locales/de/common.json';
import deBooking from './locales/de/booking.json';
import deDashboard from './locales/de/dashboard.json';
import enCommon from './locales/en/common.json';
import enBooking from './locales/en/booking.json';
import enDashboard from './locales/en/dashboard.json';

// Get saved language from localStorage or use default
const savedLanguage = localStorage.getItem('language') || 'de';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        common: deCommon,
        booking: deBooking,
        dashboard: deDashboard
      },
      en: {
        common: enCommon,
        booking: enBooking,
        dashboard: enDashboard
      }
    },
    lng: savedLanguage,
    fallbackLng: 'de',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    }
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;