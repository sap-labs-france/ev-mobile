import i18n from 'i18n-js';
import moment from 'moment';
import { I18nManager as I18nReactNativeManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import Constants from '../utils/Constants';
import Utils from '../utils/Utils';
import deJsonLanguage from './languages/de.json';
import enJsonLanguage from './languages/en.json';
import esJsonLanguage from './languages/es.json';
import frJsonLanguage from './languages/fr.json';
import ptJsonLanguage from './languages/pt.json';

export default class I18nManager {
  private static currency: string;

  public static async initialize() {
    // Get the supported locales for moment
    require('moment/locale/fr');
    require('moment/locale/de');
    require('moment/locale/en-gb');
    require('moment/locale/es');
    require('moment/locale/pt');
    // Translation files
    const translationGetters: any = {
      en: () => enJsonLanguage,
      fr: () => frJsonLanguage,
      de: () => deJsonLanguage,
      es: () => esJsonLanguage,
      pt: () => ptJsonLanguage,
    };
    // Fallback if no available language fits
    const fallback = { languageTag: Constants.DEFAULT_LANGUAGE, isRTL: false };
    // Get current locale
    const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    // Set translation files
    i18n.translations.en = enJsonLanguage;
    i18n.translations.fr = frJsonLanguage;
    i18n.translations.de = deJsonLanguage;
    i18n.translations.es = esJsonLanguage;
    i18n.translations.pt = ptJsonLanguage;
    // Update layout direction
    I18nReactNativeManager.forceRTL(isRTL);
    // Default
    i18n.locale = languageTag;
    moment.locale(languageTag);
  }

  public static switchLanguage(language: string, currency: string) {
    // Supported languages?
    if (Constants.SUPPORTED_LANGUAGES.includes(language)) {
      i18n.locale = language;
      moment.locale(language);
    }
    // Keep the currency
    I18nManager.currency = currency;
  }

  public static formatNumber(value: number): string {
    if (!isNaN(value)) {
      return new Intl.NumberFormat(i18n.locale).format(value);
    }
    return '-';
  }

  public static formatCurrency(value: number): string {
    if (!isNaN(value)) {
      const currency = I18nManager.currency;
      if (currency) {
        return new Intl.NumberFormat(i18n.locale, { style: 'currency', currency }).format(value);
      }
      return I18nManager.formatNumber(Utils.roundTo(value, 2));
    }
    return '-';
  }

  public static formatPercentage(value: number): string {
    if (isNaN(value)) {
      value = 0;
    }
    return new Intl.NumberFormat(i18n.locale, { style: 'percent' }).format(value);
  }

  public static isMetricsSystem(): boolean {
    return RNLocalize.usesMetricSystem();
  }

  private static isValidDate(date: Date): boolean {
    return !isNaN(new Date(date).getTime());
  }

  public static formatDateTime(value: Date, format: string = 'LLL') {
    if (I18nManager.isValidDate(value)) {
      return moment(value).format(format);
    }
    return '-';
  }
}
