// Note: test renderer must be required after react-native.

jest.mock('../src/utils/Utils');
import I18nManager, { MetricCompactEnum } from '../src/I18n/I18nManager';

test('computeMetricCompact', () => {
  expect(I18nManager.computeMetricCompact(1000)).toEqual(MetricCompactEnum.KILO);
});
