import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { supportedLngs } from '../ni18n.config';

export const i18nInstance = async (lang = undefined) => {
  i18n.use(Backend).init({
    initImmediate: false,
    lng: lang,
    load: 'currentOnly',
    ns: ['translation'],
    defaultNS: 'translation',
    supportedLngs,
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: '/public/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });
};
