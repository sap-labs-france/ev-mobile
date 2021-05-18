import { KeyValue } from '../types/Global';
import { EndpointCloud } from '../types/Tenant';

export default class Configuration {
  public static readonly SCP_REST_ENDPOINT_PROD = 'https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com';
  public static readonly AWS_REST_ENDPOINT_PROD = 'https://rest.e-mobility-group.com';
  public static readonly SCP_REST_ENDPOINT_QA = 'https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com';

  public static readonly SCP_CAPTCHA_BASE_URL: string = 'https://evse.cfapps.eu10.hana.ondemand.com';
  public static readonly SCP_CAPTCHA_SITE_KEY: string = '6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw';

  public static readonly DEFAULT_ENDPOINT = 'scp';
  public static readonly ENDPOINT_CLOUDS: EndpointCloud[] = [
    { id: Configuration.DEFAULT_ENDPOINT, name: 'SAP Cloud Platform', endpoint: Configuration.SCP_REST_ENDPOINT_PROD },
    { id: 'aws', name: 'Amazon Web Service', endpoint: Configuration.AWS_REST_ENDPOINT_PROD },
    { id: 'scpqa', name: 'SAP Cloud Platform QA', endpoint: Configuration.SCP_REST_ENDPOINT_QA }
  ];

  public static readonly ENDPOINT_CLOUDS_DEV: EndpointCloud[] = [
    ...Configuration.ENDPOINT_CLOUDS,
    { id: 'localhost:8020', name: '127.0.0.1:8020', endpoint: 'http://127.0.0.1:8020' },
    { id: 'android:localhost:8020', name: '10.0.2.2:8020', endpoint: 'http://10.0.2.2:8020' }
  ];

  public static ENDPOINTS_PROD: KeyValue[] = [{ key: 'general.endpoint_scp_prod', value: Configuration.SCP_REST_ENDPOINT_PROD }];

  public static ENDPOINTS_QA: KeyValue[] = [{ key: 'general.endpoint_scp_qa', value: Configuration.SCP_REST_ENDPOINT_QA }];

  public static isServerLocalePreferred = true;
}
