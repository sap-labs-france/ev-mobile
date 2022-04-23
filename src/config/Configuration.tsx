import { EndpointCloud } from '../types/Tenant';

export default class Configuration {
  public static readonly AWS_REST_ENDPOINT_PROD = 'https://charge-angels.com';

  public static readonly CAPTCHA_SITE_KEY = '6LexeY8fAAAAAIOFsduiYfGeDlRuGfAYjoL_iNI-';

  public static readonly DEFAULT_ENDPOINT_CLOUD_ID = 'aws';
  public static readonly ENDPOINT_CLOUDS: EndpointCloud[] = [
    { id: Configuration.DEFAULT_ENDPOINT_CLOUD_ID, name: 'Charge Angels', endpoint: Configuration.AWS_REST_ENDPOINT_PROD }
  ];

  public static isServerLocalePreferred = true;

  public static DEV_ENDPOINT_CLOUDS = [
    {
      id: '127.0.0.1:8080',
      name: '127.0.0.1:8080',
      endpoint: 'http://127.0.0.1:8080'
    },
    {
      id: '10.0.2.2:8080',
      name: 'android-local:8080',
      endpoint: 'http://10.0.2.2:8080'
    }
  ];

  public static readonly DEVELOPMENT_ENDPOINT_CLOUDS: EndpointCloud[] = [
    ...Configuration.ENDPOINT_CLOUDS,
    ...Configuration.DEV_ENDPOINT_CLOUDS
  ];

  public static getEndpoints(): EndpointCloud[] {
    if (__DEV__) {
      return Configuration.DEVELOPMENT_ENDPOINT_CLOUDS;
    } else {
      return Configuration.ENDPOINT_CLOUDS;
    }
  }
}
