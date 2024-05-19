import i18n from 'i18next';
import { supportedLngs } from '../ni18n.config';
import EL from '../public/locales/el/translation.json';
import EN from '../public/locales/en/translation.json';
import ES from '../public/locales/es/translation.json';
import PT from '../public/locales/pt-BR/translation.json';

export const i18nInstance = async (lang = undefined) => {
  i18n.init({
    initImmediate: false,
    lng: lang,
    load: 'currentOnly',
    ns: ['translation'],
    defaultNS: 'translation',
    supportedLngs,
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: { translation: EN },
      el: { translation: EL },
      es: { translation: ES },
      pt: { translation: PT },
    },
    interpolation: {
      escapeValue: false,
    },
  });
};
