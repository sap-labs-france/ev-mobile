// Get the supported locales for moment
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/cs';
import 'moment/locale/pt-br';

import i18n from 'i18n-js';
import moment from 'moment';
import { I18nManager as I18nReactNativeManager } from 'react-native';
import { findBestAvailableLanguage, usesMetricSystem } from 'react-native-localize';

import Constants from '../utils/Constants';
import Utils from '../utils/Utils';
import csJsonLanguage from './languages/cs.json';
import deJsonLanguage from './languages/de.json';
import enJsonLanguage from './languages/en.json';
import esJsonLanguage from './languages/es.json';
import frJsonLanguage from './languages/fr.json';
import itJsonLanguage from './languages/it.json';
import ptJsonLanguage from './languages/pt.json';
import DurationUnitFormat, { DurationUnitFormatOptions } from 'intl-unofficial-duration-unit-format';
import { DistanceUnit } from '../types/Settings';

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  [option: string]: any;
  compactThreshold?: number;
  compactStyle?: NumberFormatCompactStyleEnum;
}

export enum NumberFormatCompactStyleEnum {
  METRIC = 'metric',
  FINANCE = 'finance'
}

export enum NumberFormatSymbolsEnum {
  PERCENT_SIGN = 'percentSign',
  UNIT = 'unit',
  CURRENCY = 'currency',
  COMPACT = 'compact'
}

export enum MetricCompactEnum {
  KILO = 'k',
  MEGA = 'M',
  GIGA = 'G',
  TERA = 'T'
}

export interface FormatNumberResult {
  unit?: string;
  currency?: string;
  compact?: string;
  percentSign?: string;
  value?: string;
}

export enum NumberFormatNotationEnum {
  SCIENTIFIC = 'scientific',
  ENGINEERING = 'engineering',
  COMPACT = 'compact',
  STANDARD = 'standard'
}

export enum NumberFormatStyleEnum {
  DECIMAL = 'decimal',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  UNIT = 'unit'
}

export default class I18nManager {
  public static currency: string;
  public static distanceUnit: string;

  public static initialize(): void {
    // Translation files
    const translationGetters: any = {
      en: () => enJsonLanguage,
      fr: () => frJsonLanguage,
      de: () => deJsonLanguage,
      es: () => esJsonLanguage,
      pt: () => ptJsonLanguage,
      it: () => itJsonLanguage,
      cs: () => csJsonLanguage
    };
    // Fallback if no available language fits
    i18n.fallbacks = true;
    const fallback = { languageTag: Constants.DEFAULT_LANGUAGE, isRTL: false };
    // Get current locale
    const { languageTag, isRTL } = findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;
    // Set translation files
    i18n.translations.en = enJsonLanguage;
    i18n.translations.fr = frJsonLanguage;
    i18n.translations.de = deJsonLanguage;
    i18n.translations.es = esJsonLanguage;
    i18n.translations.pt = ptJsonLanguage;
    i18n.translations.it = itJsonLanguage;
    i18n.translations.cs = csJsonLanguage;
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

  public static switchDistanceUnit(distanceUnit: DistanceUnit): void {
    I18nManager.distanceUnit = distanceUnit;
  }

  public static formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
    if (!isNaN(value)) {
     return Intl.NumberFormat(i18n.locale, options).format(value);
    }
    return '-';
  }

  public static formatNumberWithCompacts(value: number, options: FormatNumberOptions = {}, locale: string = i18n.locale): FormatNumberResult {
    options = {... options };

    // Check currency options
    if (!options.currency) {
      delete options.currency
      delete options.currencySign
      delete options.currencyDisplay
      // Intl doc: If the style is "currency", currency option must be provided
      if (options.style === NumberFormatStyleEnum.CURRENCY) {
        delete options.style
      }
    }

    // Check unit options
    if (!options.unit) {
      delete options.unit;
      delete options.unitDisplay;
      // Intl doc: If the style is "unit", unit option must be provided
      if (options.style === NumberFormatStyleEnum.UNIT) {
        delete options.style;
      }
    }

    const isUnit = options.unit;
    const isPercent = options.style === NumberFormatStyleEnum.PERCENT;
    const isCurrency = options.currency;
    const shouldCompact = !options.compactThreshold || (options.compactThreshold && value > options.compactThreshold);

    if (!shouldCompact && options.notation === NumberFormatNotationEnum.COMPACT) {
      delete options.notation;
    }

    // Delete all unset options
    Object.keys(options).forEach((option) => options[option] ?? delete options[option]);

    // Format the given value with the given options
    try {
      const parts = Intl.NumberFormat(locale, options).formatToParts(value);
      // Compute the compact (prefix) if needed (Intl namespace does not supports metric compacts yet)
      let compact = this.getFormatPartValue(parts, NumberFormatSymbolsEnum.COMPACT);
      if (compact && options.compactStyle === NumberFormatCompactStyleEnum.METRIC) {
        compact = this.computeMetricCompact(value);
      }
      return {
        value: this.concatenateNumberFormatParts(parts),
        ...(isCurrency && {currency: this.getFormatPartValue(parts, NumberFormatSymbolsEnum.CURRENCY)}),
        ...(isUnit && {unit: this.getFormatPartValue(parts, NumberFormatSymbolsEnum.UNIT)}),
        ...(compact && {compact}),
        ...(isPercent && {percentSign: this.getFormatPartValue(parts, NumberFormatSymbolsEnum.PERCENT_SIGN)})
      };
    } catch ( e ) {
      return null;
    }
  }

  public static formatCurrency(value: number, currency?: string): string {
    currency = currency?.toUpperCase();
    if (!isNaN(value)) {
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
    const distanceUnit = I18nManager.distanceUnit;
    switch ( distanceUnit ) {
      case DistanceUnit.KILOMETERS:
        return true;
      case DistanceUnit.MILES:
        return false;
      default:
        return usesMetricSystem();
    }
  }

  public static formatDateTime(value: Date | string, options?: Intl.DateTimeFormatOptions ): string {
    if (I18nManager.isValidDate(value)) {
      return Intl.DateTimeFormat(i18n.locale, options).format(new Date(value));
    }
    return '-';
  }

  // We use an external lib until ECMAScript Intl namespace features DurationFormat pending proposition
  // Default format for TIMER style is hh:mm
  public static formatDuration(durationSecs: number, options?: DurationUnitFormatOptions): string {
    // Add 0 to have double-digit hours when < 10
    if (options?.style === DurationUnitFormat.styles.TIMER && !options?.format) {
      options.format =  `${durationSecs < 36000 ? '0' : ''}{hour}:{minutes}`;
    }
    const formatter =  new DurationUnitFormat(i18n.locale, options);
    return formatter.format(durationSecs);
  }

  public static isValidDate(date: Date | string): boolean {
    return !isNaN(new Date(date).getTime());
  }

 static concatenateNumberFormatParts(parts: Intl.NumberFormatPart[] = []): string {
    return parts
      .filter((p) => !(p.type.toUpperCase() in NumberFormatSymbolsEnum))
      .map((p) => p.value)
      .join('')
      .trim();
  }

  static getFormatPartValue(parts: (Intl.DateTimeFormatPart | Intl.NumberFormatPart)[], type: Intl.DateTimeFormatPartTypes | Intl.NumberFormatPartTypes) {
    return parts.find((p) => p.type === type)?.value;
  }

  static computeMetricCompact(value: number): MetricCompactEnum {
    if (value < 1000) {
      return null;
    }
    if (value >= 1000 && value < 1000000) {
      return MetricCompactEnum.KILO;
    }
    if (value >= 1000000 && value < 1000000000) {
      return MetricCompactEnum.MEGA;
    }
    if (value >= 1000000000 && value < 1000000000000) {
      return MetricCompactEnum.GIGA;
    }
    return MetricCompactEnum.TERA;
  }

  public static formatDistance(distanceMeters: number, useMetricSystem?: boolean): string {
    const isMetricSystem = useMetricSystem ?? I18nManager.isMetricsSystem();
    if(isMetricSystem) {
      return (
        distanceMeters < 1000 ? `${I18nManager.formatNumber(distanceMeters, {maximumFractionDigits: 0})} m` : `${I18nManager.formatNumber(distanceMeters / 1000, {maximumFractionDigits: 1})} km`
      );
    } else {
      const distanceYard = distanceMeters * 1.09361;
      return (
        distanceYard < 1760 ? `${I18nManager.formatNumber(distanceYard, {maximumFractionDigits: 0})} yd` : `${I18nManager.formatNumber(distanceYard / 1760, {maximumFractionDigits: 1})} mi`
      );
    }
  }

  public static isLocale24Hour(locale: string): boolean {
    locale = locale.replace('_', '-');
    const parts = new Intl.DateTimeFormat(locale, {timeStyle: 'short', dateStyle: 'short'}).formatToParts(new Date());
    const dayPeriod = I18nManager.getFormatPartValue(parts, 'dayPeriod');
    return !dayPeriod;
  }
}
