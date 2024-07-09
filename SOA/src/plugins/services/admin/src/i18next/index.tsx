import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar';

i18n.use(initReactI18next).init({
  resources: {
    ar,
  },
  lng: 'ar', // if you're using a language detector, do not define the lng option
  fallbackLng: 'ar',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});
