import PagingParams from '../types/PagingParams';

export default class Constants {
  public static readonly REST_RESPONSE_SUCCESS = 'Success';

  public static readonly SUPPORTED_LOCALES = ['en_US', 'fr_FR', 'de_DE', 'es_MX'];
  public static readonly SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es'];
  public static readonly DEFAULT_LOCALE = 'en_US';
  public static readonly DEFAULT_LANGUAGE = 'en';

  public static readonly DEFAULT_DURATION = '00:00';
  public static readonly DEFAULT_DURATION_WITH_SECS = '00:00:00';

  // Auto Refresh
  public static readonly AUTO_REFRESH_DUPS_INTERVAL = 2 * 1000;
  public static readonly AUTO_REFRESH_ON_ERROR_PERIOD_MILLIS = 2 * 1000;
  public static readonly AUTO_REFRESH_SHORT_PERIOD_MILLIS = 3 * 1000;
  public static readonly AUTO_REFRESH_MEDIUM_PERIOD_MILLIS = 10 * 1000;
  public static readonly AUTO_REFRESH_LONG_PERIOD_MILLIS = 30 * 1000;

  public static readonly SEARCH_CHECK_PERIOD_MILLIS = 50;
  public static readonly ANIMATION_PERIOD_MILLIS = 5 * 1000;
  public static readonly ANIMATION_SHOW_HIDE_MILLIS = 500;
  public static readonly ANIMATION_ROTATION_MILLIS = 500;

  // Keystore
  public static readonly SHARED_PREFERENCES_NAME = 'eMobilityPreferences';
  public static readonly KEYCHAIN_SERVICE = 'eMobilityKeyChain';

  // Paging
  public static readonly DEFAULT_PAGING: PagingParams = {
    limit: 10,
    skip: 0,
  };
  public static readonly ONLY_ONE_PAGING: PagingParams = {
    limit: 1,
    skip: 0,
  };
  public static readonly ONLY_RECORD_COUNT_PAGING: PagingParams = {
    limit: 10,
    skip: 0,
    onlyRecordCount: true
  };
  public static readonly PAGING_SIZE = 10;
}
