import i18n, { ToCurrencyOptions, ToNumberOptions, ToPercentageOptions } from "i18n-js";
import moment from "moment";
import { I18nManager as I18nReactNativeManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import deJsonLanguage from "./languages/de.json";
import enJsonLanguage from "./languages/en.json";
import frJsonLanguage from "./languages/fr.json";

export default class I18nManager {

  public static async initialize() {
    // Get the supported locales
    require("moment/locale/fr");
    require("moment/locale/de");
    require("moment/locale/en-gb");
    const translationGetters: any = {
      en: () => enJsonLanguage,
      fr: () => frJsonLanguage,
      de: () => deJsonLanguage,
    };
    // Fallback if no available language fits
    const fallback = { languageTag: "en", isRTL: false };
    // Get current locale
    const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    // Set tranlation files
    i18n.translations['en'] = enJsonLanguage;
    i18n.translations['fr'] = frJsonLanguage;
    i18n.translations['de'] = deJsonLanguage;
    // Update layout direction
    I18nReactNativeManager.forceRTL(isRTL);
    // Default
    i18n.locale = 'fr';
    moment.locale('fr');
  }

  public static switchLocale(locale: string) {
    i18n.locale = locale;
    moment.locale(locale);
  }

  public static formatNumber(value: number, options: ToNumberOptions = { strip_insignificant_zeros: true }): string {
    return i18n.toNumber(value, options);
  }

  public static formatCurrency(value: number, options: ToCurrencyOptions = { precision: 0 }): string {
    return i18n.toCurrency(value, options);
  }

  public static formatPercentage(value: number, options: ToPercentageOptions = { precision: 0 }): string {
    return i18n.toPercentage(value, options);
  }

  public static formatDateTime(value: Date, format: string = 'LLL') {
    return moment(value).format(format);
  }
}