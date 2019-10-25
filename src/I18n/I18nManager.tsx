import i18n, { ToCurrencyOptions, ToNumberOptions, ToPercentageOptions } from "i18n-js";
import moment from "moment";
import { I18nManager as I18nReactNativeManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import Constants from "../utils/Constants";
import deJsonLanguage from "./languages/de.json";
import enJsonLanguage from "./languages/en.json";
import frJsonLanguage from "./languages/fr.json";

export default class I18nManager {

  public static async initialize() {
    // Get the supported locales for moment
    require("moment/locale/fr");
    require("moment/locale/de");
    require("moment/locale/en-gb");
    // Translation files
    const translationGetters: any = {
      en: () => enJsonLanguage,
      fr: () => frJsonLanguage,
      de: () => deJsonLanguage,
    };
    // Fallback if no available language fits
    const fallback = { languageTag: Constants.DEFAULT_LANGUAGE, isRTL: false };
    // Get current locale
    const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    // Set tranlation files
    i18n.translations['en'] = enJsonLanguage;
    i18n.translations['fr'] = frJsonLanguage;
    i18n.translations['de'] = deJsonLanguage;
    // Update layout direction
    I18nReactNativeManager.forceRTL(isRTL);
    // Default
    i18n.locale = languageTag;
    moment.locale(languageTag);
  }

  public static switchLanguage(language: string = Constants.DEFAULT_LANGUAGE) {
    // Supported languages?
    if (Constants.SUPPORTED_LANGUAGES.includes(language)) {
      console.log('====================================');
      console.log(language);
      console.log('====================================');
      i18n.locale = language;
      moment.locale(language);
    }
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