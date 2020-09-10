export default class Configuration {
  public static readonly CENTRAL_REST_SERVER_SERVICE_BASE_URL_PROD: string = 'https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com';
  public static readonly CENTRAL_REST_SERVER_SERVICE_BASE_URL_QA: string = 'https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com';
  public static readonly CAPTCHA_BASE_URL: string = 'https://evse.cfapps.eu10.hana.ondemand.com';
  public static readonly CAPTCHA_SITE_KEY: string = '6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw';
  public static readonly DEFAULT_TENANTS_LIST_PROD: { subdomain: string, name: string }[] = [
    { subdomain: 'slf', name: 'SAP Labs France' },
    { subdomain: 'slfcah', name: 'SAP Labs France (charge@home)' },
    { subdomain: 'sapse', name: 'SAP SE' },
    { subdomain: 'sapsecah', name: 'SAP SE (charge@home)' },
    { subdomain: 'proviridis', name: 'Proviridis' },
    { subdomain: 'sapbelgium', name: 'SAP Belgium' },
  ]
  public static readonly DEFAULT_TENANTS_LIST_QA: { subdomain: string, name: string }[] = [
    { subdomain: 'testcharger', name: 'SAP Labs New Charging Stations Tests' },
    { subdomain: 'testperf', name: 'SAP Labs Performance Tests' },
    { subdomain: 'demopricing', name: 'SAP Labs Demo for Pricing' },
    { subdomain: 'demobilling', name: 'SAP Labs Demo for Billing' },
    { subdomain: 'slf', name: 'SAP Labs France (prod)' },
    { subdomain: 'slfcah', name: 'SAP Labs France (Charge@Home) (prod)' },
  ];
  public static isServerLocalePreferred: boolean = true;
}
