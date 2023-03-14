// Note: test renderer must be required after react-native.

import i18n from 'i18n-js';

import I18nManager, {
  FormatNumberOptions,
  MetricCompactEnum,
  NumberFormatCompactStyleEnum,
  NumberFormatNotationEnum, NumberFormatStyleEnum
} from '../src/I18n/I18nManager';

test('computeMetricCompact', () => {
  expect(I18nManager.computeMetricCompact(1000)).toEqual(MetricCompactEnum.KILO);
  expect(I18nManager.computeMetricCompact(10000)).toEqual(MetricCompactEnum.KILO);
  expect(I18nManager.computeMetricCompact(100000)).toEqual(MetricCompactEnum.KILO);
  expect(I18nManager.computeMetricCompact(1000000)).toEqual(MetricCompactEnum.MEGA);
  expect(I18nManager.computeMetricCompact(10000000)).toEqual(MetricCompactEnum.MEGA);
  expect(I18nManager.computeMetricCompact(100000000)).toEqual(MetricCompactEnum.MEGA);
  expect(I18nManager.computeMetricCompact(1000000000)).toEqual(MetricCompactEnum.GIGA);
  expect(I18nManager.computeMetricCompact(10000000000)).toEqual(MetricCompactEnum.GIGA);
  expect(I18nManager.computeMetricCompact(100000000000)).toEqual(MetricCompactEnum.GIGA);
  expect(I18nManager.computeMetricCompact(1000000000000)).toEqual(MetricCompactEnum.TERA);
  expect(I18nManager.computeMetricCompact(10000000000000)).toEqual(MetricCompactEnum.TERA);
  expect(I18nManager.computeMetricCompact(100000000000000)).toEqual(MetricCompactEnum.TERA);
});

test('getNumberFormatPartValue', () => {
  const numberFormatParts = [
    {type: 'currency', value: 'EUR'},
    {type: 'compact', value: 'million'},
    {type: 'integer', 'value': '756000000'}
  ]
  expect(I18nManager.getFormatPartValue(numberFormatParts as Intl.NumberFormatPart[], 'currency')).toEqual('EUR');
  expect(I18nManager.getFormatPartValue(numberFormatParts as Intl.NumberFormatPart[], 'compact')).toEqual('million');
  expect(I18nManager.getFormatPartValue(numberFormatParts as Intl.NumberFormatPart[], 'integer')).toEqual('756000000');
  expect(I18nManager.getFormatPartValue(numberFormatParts as Intl.NumberFormatPart[], 'group')).toEqual(undefined);
});

test('concatenateNumberFormatParts', () => {
  const numberFormatParts = [
    {type: 'minusSign', 'value': '-'},
    {type: 'integer', 'value': '756'},
    {type: 'group', 'value': ' '},
    {type: 'integer', 'value': '000'},
    {type: 'group', 'value': ' '},
    {type: 'integer', 'value': '000'},
    {type: 'decimal', 'value': ','},
    {type: 'fraction', 'value': '234'},
    {type: 'unit', 'value': 'Watt'}
  ];
  expect(I18nManager.concatenateNumberFormatParts(numberFormatParts as Intl.NumberFormatPart[])).toEqual('-756 000 000,234');
});

test('formatNumberWithCompacts MetricShortCompact', () => {
  const formatNumberOptions = {
    notation: NumberFormatNotationEnum.COMPACT,
    compactStyle: NumberFormatCompactStyleEnum.METRIC,
    compactDisplay: 'short',
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions);
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('k');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions);
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('M');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions);
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('G');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000000.457, formatNumberOptions);
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('T');
});

test('formatNumberWithCompacts FinanceShortCompact', () => {
  const formatNumberOptions = {
    notation: NumberFormatNotationEnum.COMPACT,
    compactStyle: NumberFormatCompactStyleEnum.FINANCE,
    compactDisplay: 'short',
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions, 'en');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('K');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions, 'fr');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('k');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('mil');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions, 'en');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('M');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions, 'fr');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('M');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('M');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions, 'en');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('B');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions, 'fr');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('Md');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('mil\u00a0M');
});

test('formatNumberWithCompacts FinanceLongCompact', () => {
  const formatNumberOptions = {
    notation: NumberFormatNotationEnum.COMPACT,
    compactStyle: NumberFormatCompactStyleEnum.FINANCE,
    compactDisplay: 'long',
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions);
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('thousand');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions, 'fr');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('mille');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('mil');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions, 'en');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('million');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions, 'fr');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('millions');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('millones');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions, 'en');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('billion');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions, 'fr');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('milliards');

  formattedNumber = I18nManager.formatNumberWithCompacts(127486000000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('127');
  expect(formattedNumber?.compact).toEqual('mil millones');
});

test('formatNumberWithCompacts CompactThreshold', () => {
  const formatNumberOptions = {
    notation: NumberFormatNotationEnum.COMPACT,
    compactDisplay: 'long',
    compactThreshold: 1200000
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(1000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1000,457');

  formattedNumber = I18nManager.formatNumberWithCompacts(1000000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1.000.000,457');

  formattedNumber = I18nManager.formatNumberWithCompacts(1200000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1,2');
});

test('formatNumberWithCompacts MaxDigits', () => {
  const formatNumberOptions = {
    notation: NumberFormatNotationEnum.COMPACT,
    compactStyle: NumberFormatCompactStyleEnum.FINANCE,
    compactDisplay: 'long',
    maximumFractionDigits: 0
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(1200000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1');
  expect(formattedNumber?.compact).toEqual('millón');

  formatNumberOptions.maximumFractionDigits = 9;
  formattedNumber = I18nManager.formatNumberWithCompacts(1200000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1,200000457');
  expect(formattedNumber?.compact).toEqual('millones');
});

test('formatNumberWithCompacts MinDigits', () => {
  const formatNumberOptions = {
    notation: NumberFormatNotationEnum.COMPACT,
    compactStyle: NumberFormatCompactStyleEnum.FINANCE,
    compactDisplay: 'long',
    maximumFractionDigits: 9,
    minimumFractionDigits: 3
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(1200000.00, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1,200');
  expect(formattedNumber?.compact).toEqual('millones');

  formattedNumber = I18nManager.formatNumberWithCompacts(1200000.457, formatNumberOptions, 'es');
  expect(formattedNumber?.value).toEqual('1,200000457');
  expect(formattedNumber?.compact).toEqual('millones');
});

test('formatNumberWithCompacts Currency', () => {
  const formatNumberOptions = {
    style: NumberFormatStyleEnum.CURRENCY,
    maximumFractionDigits: 0
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(1200000.00, formatNumberOptions, 'es');
  expect(formattedNumber.value).toEqual('1.200.000');

  formatNumberOptions.currency = null;
  formattedNumber = I18nManager.formatNumberWithCompacts(1200000.00, formatNumberOptions, 'es');
  expect(formattedNumber.value).toEqual('1.200.000');
});

test('formatNumberWithCompacts Unit', () => {
  const formatNumberOptions = {
    style: NumberFormatStyleEnum.UNIT,
    maximumFractionDigits: 0
  } as FormatNumberOptions;
  let formattedNumber = I18nManager.formatNumberWithCompacts(1200000.00, formatNumberOptions, 'es');
  expect(formattedNumber.value).toEqual('1.200.000');

  formatNumberOptions.unit = null;
  formattedNumber = I18nManager.formatNumberWithCompacts(1200000.00, formatNumberOptions, 'es');
  expect(formattedNumber.value).toEqual('1.200.000');
});

test('formatNumberWithCompacts NullOptions', () => {
  const formatNumberOptions = {
    style: NumberFormatStyleEnum.UNIT,
    unit: null,
    currency: 'EUR',
    compactStyle: null,
    currencySign: null,
    maximumFractionDigits: null
  } as FormatNumberOptions;
  const formattedNumber = I18nManager.formatNumberWithCompacts(1200000.00, formatNumberOptions, 'es');
  expect(formattedNumber.value).toEqual('1.200.000');
});

test('formatDistance', () => {
  i18n.locale = 'en';
  let formattedDistance = I18nManager.formatDistance(999, true);
  expect(formattedDistance).toEqual('999 m');
  formattedDistance = I18nManager.formatDistance(999, false);
  expect(formattedDistance).toEqual('1,093 yd');
  formattedDistance = I18nManager.formatDistance(1700, true);
  expect(formattedDistance).toEqual('1.7 km');
  formattedDistance = I18nManager.formatDistance(1700, false);
  expect(formattedDistance).toEqual('1.1 mi');
});
