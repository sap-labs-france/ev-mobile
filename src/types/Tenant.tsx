import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import Address from './Address';

export default interface Tenant extends CreatedUpdatedProps, ListItem {
  id: string;
  name: string;
  email: string;
  address: Address;
  subdomain: string;
  components?: TenantComponent;
  logo: string;
}

export interface TenantComponent {
  ocpi?: TenantComponentContent;
  oicp?: TenantComponentContent;
  organization?: TenantComponentContent;
  pricing?: TenantComponentContent;
  billing?: TenantComponentContent;
  refund?: TenantComponentContent;
  statistics?: TenantComponentContent;
  analytics?: TenantComponentContent;
  smartCharging?: TenantComponentContent;
  asset?: TenantComponentContent;
  car?: TenantComponentContent;
  carConnector?: TenantComponentContent;
}

export interface TenantComponentContent {
  active: boolean;
  type: string;
}

export interface TenantConnection {
  subdomain: string;
  name: string;
  endpoint: EndpointCloud;
}

export interface EndpointCloud {
  id?: string;
  name: string;
  endpoint: string;
}

export enum TenantComponents {
  OCPI = 'ocpi',
  OICP = 'oicp',
  REFUND = 'refund',
  PRICING = 'pricing',
  ORGANIZATION = 'organization',
  STATISTICS = 'statistics',
  ANALYTICS = 'analytics',
  BILLING = 'billing',
  ASSET = 'asset',
  SMART_CHARGING = 'smartCharging',
  CAR = 'car',
  CAR_CONNECTOR = 'carConnector'
}
