export default class Configuration {
  public static centralRestServerServiceBaseURLProd: string = 'https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com';
  public static centralRestServerServiceBaseURLQA: string = 'https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com';
  public static captchaBaseUrl: string = 'https://evse.cfapps.eu10.hana.ondemand.com';
  public static captchaSiteKey: string = '6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw';
  public static defaultTenantsListProd: { subdomain: string, name: string }[] = [
    { subdomain: 'slf', name: 'SAP Labs France' },
    { subdomain: 'slfcah', name: 'SAP Labs France (charge@home)' },
    { subdomain: 'sapse', name: 'SAP SE' },
    { subdomain: 'sapsecah', name: 'SAP SE (charge@home)' },
    { subdomain: 'proviridis', name: 'Proviridis' },
    { subdomain: 'sapbelgium', name: 'SAP Belgium' },
  ]
  public static defaultTenantsListQA: { subdomain: string, name: string }[] = [
    { subdomain: 'testcharger', name: 'SAP Labs New Charging Stations Tests' },
    { subdomain: 'testperf', name: 'SAP Labs Performance Tests' },
    { subdomain: 'demopricing', name: 'SAP Labs Demo for Pricing' },
    { subdomain: 'demobilling', name: 'SAP Labs Demo for Billing' },
    { subdomain: 'slf', name: 'SAP Labs France (prod)' },
    { subdomain: 'slfcah', name: 'SAP Labs France (Charge@Home) (prod)' },
  ];
  public static isServerLocalePreferred: boolean = true;
}
