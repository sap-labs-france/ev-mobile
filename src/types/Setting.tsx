import CreatedUpdatedProps from './CreatedUpdatedProps';

export enum ComponentType {
  OCPI = 'ocpi',
  ORGANIZATION = 'organization',
  PRICING = 'pricing',
  BILLING = 'billing',
  REFUND = 'refund',
  STATISTICS = 'statistics',
  ANALYTICS = 'analytics',
  SMART_CHARGING = 'smartCharging'
}

export enum IdentifierType {
  PRICING = 'pricing',
  ANALYTICS = 'analytics',
  REFUND = 'refund',
  OCPI = 'ocpi'
}

export default interface Setting extends CreatedUpdatedProps {
  id?: string;
  identifier: IdentifierType;
  sensitiveData: string[];
  content: SettingContent;
}

export enum SettingContentType {
  GIREVE = 'gireve',
  SAC = 'sac',
  CONCUR = 'concur',
  SIMPLE = 'simple',
  CONVERGENT_CHARGING = 'convergentCharging',
}

export interface SettingContent {
  type: SettingContentType;
  ocpi?: OcpiSettings;
  simple?: SimplePricingSettings;
  convergentCharging?: ConvergentChargingPricingSettings;
  sac?: AnalyticsSettings;
  links?: AnalyticsLink[];
  concur?: ConcurRefundSettings;
}

export interface PricingSetting {
}

export interface SimplePricingSettings extends PricingSetting {
  price: number;
  currency: string;
}

export interface ConvergentChargingPricingSettings extends PricingSetting {
  url: string;
  chargeableItemName: string;
  user: string;
  password: string;
}

export interface OcpiSettings {
  countryCode: string;
  partyID: string;
  businessDetails: {
    name: string;
    website: string;
    logo: {
      url: string;
      thumbnail: string;
      category: string;
      type: string;
      width: string;
      height: string;
    };
  };
}

export interface AnalyticsSettings {
  mainUrl: string;
  timezone: string;
}

export interface AnalyticsLink {
  id: string;
  name: string;
  description: string;
  role: string;
  url: string;
}

export interface ConcurRefundSettings {
  authenticationUrl: string;
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  paymentTypeId: string;
  expenseTypeCode: string;
  policyId: string;
  reportName: string;
}
