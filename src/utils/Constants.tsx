import { PagingParams } from '../types/QueryParams';

export default class Constants {
  public static readonly REST_RESPONSE_SUCCESS = 'Success';

  public static readonly SUPPORTED_LOCALES = ['en_US', 'fr_FR', 'es_ES', 'de_DE', 'pt_PT', 'it_IT', 'cs_CZ', 'en_AU'];
  public static readonly SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es', 'pt', 'it', 'cs'];
  public static readonly DEFAULT_LOCALE = 'en_US';
  public static readonly DEFAULT_LANGUAGE = 'en';

  public static readonly ANONYMIZED_VALUE = '####';
  public static readonly HYPHEN = '-';

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
  public static readonly PAGING_SIZE = 25;
  public static readonly DEFAULT_PAGING: PagingParams = {
    limit: Constants.PAGING_SIZE,
    skip: 0
  };
  public static readonly ONLY_ONE_RECORD: PagingParams = {
    limit: 1,
    skip: 0
  };
  public static readonly ONLY_RECORD_COUNT: PagingParams = {
    limit: 1,
    skip: 0,
    onlyRecordCount: true
  };

  public static readonly REGEX_VALIDATION_LATITUDE = /^-?([1-8]?[1-9]|[1-9]0)\.{0,1}[0-9]*$/;
  public static readonly REGEX_VALIDATION_LONGITUDE = /^-?([1]?[0-7][0-9]|[1]?[0-8][0]|[1-9]?[0-9])\.{0,1}[0-9]*$/;
  public static readonly MAX_DISTANCE_METERS = 500000; // 500km autonomy

  public static readonly VIN_FULL = 'Vehicle Identification Number';
  public static readonly VIN = 'VIN';
}
