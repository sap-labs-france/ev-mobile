import { KeyValue } from 'types/Global';
import { EndpointCloud, TenantConnection } from 'types/Tenant';

export default class Configuration {
  public static readonly SCP_REST_ENDPOINT_PROD = 'https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com';
  public static readonly AWS_REST_ENDPOINT_PROD = 'https://rest.e-mobility-group.com';
  public static readonly SCP_REST_ENDPOINT_QA = 'https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com';
  public static readonly LOCALHOST_REST_ENDPOINT_QA = 'http://localhost:8090';

  public static readonly SCP_CAPTCHA_BASE_URL: string = 'https://evse.cfapps.eu10.hana.ondemand.com';
  public static readonly SCP_CAPTCHA_SITE_KEY: string = '6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw';

  public static readonly ENDPOINT_CLOUDS_PROD: EndpointCloud[] = [
    { id: 'scp', name: 'SAP Cloud Platform', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { id: 'aws', name: 'Amazon Web Service', endpoint: Configuration.AWS_REST_ENDPOINT_PROD },
  ];

  public static readonly ENDPOINT_CLOUDS_QA: EndpointCloud[] = [
    ...Configuration.ENDPOINT_CLOUDS_PROD,
    { id: 'scpqa', name: 'SAP Cloud Platform QA', endpoint: Configuration.SCP_REST_ENDPOINT_QA },
    { id: 'localhost', name: 'Localhost QA', endpoint: Configuration.LOCALHOST_REST_ENDPOINT_QA },
  ];

  public static readonly DEFAULT_TENANTS_LIST_PROD: TenantConnection[] = [
    { subdomain: 'slf', name: 'SAP Labs France', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'slfcah', name: 'SAP Labs France (charge@home)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapse', name: 'SAP SE', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapsecah', name: 'SAP SE (charge@home)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapfrance', name: 'SAP France', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapfrancecah', name: 'SAP France (charge@home)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapbelgium', name: 'SAP Belgium', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapportugal', name: 'SAP Portugal', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'proviridis', name: 'Proviridis', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'imredd', name: 'IMREDD', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'mairiedemonaco', name: 'Mairie de Monaco', endpoint: Configuration.AWS_REST_ENDPOINT_PROD },
  ];

  public static readonly DEFAULT_TENANTS_LIST_QA: TenantConnection[] = [
    { subdomain: 'slf', name: 'SAP Labs France (localhost)', endpoint: Configuration.LOCALHOST_REST_ENDPOINT_QA },
    { subdomain: 'testcharger', name: 'SAP Labs New Charging Stations Tests', endpoint: Configuration.SCP_REST_ENDPOINT_QA },
    { subdomain: 'testperf', name: 'SAP Labs Performance Tests', endpoint: Configuration.SCP_REST_ENDPOINT_QA },
    { subdomain: 'demopricing', name: 'SAP Labs Demo for Pricing', endpoint: Configuration.SCP_REST_ENDPOINT_QA },
    { subdomain: 'demobilling', name: 'SAP Labs Demo for Billing', endpoint: Configuration.SCP_REST_ENDPOINT_QA },
    { subdomain: 'slf', name: 'SAP Labs France (prod)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'slfcah', name: 'SAP Labs France (Charge@Home) (prod)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapfrance', name: 'SAP France (prod)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { subdomain: 'sapfrancecah', name: 'SAP France (charge@home) (prod)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
  ];

  public static ENDPOINTS_PROD: KeyValue[] = [
    { key: 'general.endpoint_scp_prod', value: Configuration.SCP_REST_ENDPOINT_PROD },
  ];

  public static ENDPOINTS_QA: KeyValue[] = [
    { key: 'general.endpoint_scp_qa', value: Configuration.SCP_REST_ENDPOINT_QA },
  ];

  public static isServerLocalePreferred: boolean = true;
}
