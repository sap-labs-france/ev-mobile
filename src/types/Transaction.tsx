import ChargingStation from '../types/ChargingStation';
import Consumption from './Consumption';
import ListItem from './ListItem';
import User from './User';
import Car from './Car';
import Tag from './Tag';

export enum InactivityStatus {
  INFO = 'I',
  WARNING = 'W',
  ERROR = 'E'
}

export default interface Transaction extends ListItem {
  siteID: string;
  siteAreaID: string;
  connectorId: number;
  tagID: string;
  userID: string;
  chargeBoxID: string;
  signedData?: any;
  user?: User;
  stop?: {
    tagID: string;
    userID: string;
    user?: User;
    meterStop: number;
    price: number;
    roundedPrice: number;
    priceUnit: string;
    pricingSource: string;
    stateOfCharge: number;
    totalInactivitySecs: number;
    extraInactivitySecs: number;
    inactivityStatus?: InactivityStatus;
    totalConsumptionWh: number;
    totalDurationSecs: number;
    timestamp: Date;
    transactionData?: any;
    signedData?: any;
  };
  remotestop?: {
    timestamp: Date;
    tagID: string;
    userID: string;
  };
  refundData?: {
    refundId: string;
    refundedAt: Date;
    type: any;
    reportId?: string;
    status?: any;
  };
  chargeBox?: ChargingStation;
  meterStart: number;
  timestamp: Date;
  price: number;
  roundedPrice: number;
  priceUnit: string;
  pricingSource: string;
  stateOfCharge: number;
  timezone: string;
  currentTimestamp?: Date;
  currentTotalInactivitySecs: number;
  currentInactivityStatus?: InactivityStatus;
  currentStateOfCharge: number;
  numberOfMeterValues: number;
  currentInstantWatts: number;
  currentInstantWattsL1?: number;
  currentInstantWattsL2?: number;
  currentInstantWattsL3?: number;
  currentInstantWattsDC?: number;
  currentConsumptionWh?: number;
  currentCumulatedPrice: number;
  currentTotalConsumptionWh: number;
  currentTotalDurationSecs: number;
  currentSignedData?: number;
  currentInstantVolts?: number;
  currentInstantVoltsL1?: number;
  currentInstantVoltsL2?: number;
  currentInstantVoltsL3?: number;
  currentInstantVoltsDC?: number;
  currentInstantAmps?: number;
  currentInstantAmpsL1?: number;
  currentInstantAmpsL2?: number;
  currentInstantAmpsL3?: number;
  currentInstantAmpsDC?: number;
  uniqueId?: string;
  errorCode?: number;
  values?: Consumption[];
  carStateOfCharge?: number;
  targetStateOfCharge?: number;
  departureTime?: string;
}

export enum StartTransactionErrorCode {
  BILLING_NO_PAYMENT_METHOD = 'no_payment_method', // start transaction is not possible - user has no payment method
  BILLING_NO_TAX = 'billing_no_tax', // start transaction is not possible - the tax ID is not set or inconsistent
  BILLING_NO_SETTINGS = 'billing_no_settings', // start transaction not possible - billing settings are not set (or partially set)
  BILLING_INCONSISTENT_SETTINGS = 'billing_inconsistent_settings' // start transaction not possible - billing settings are inconsistent
}

export interface UserSessionContext {
  car?: Car;
  tag?: Tag;
  errorCodes?: StartTransactionErrorCode[];
  smartChargingSessionParameters: SmartChargingSessionParameters;
}

export interface SmartChargingSessionParameters {
  departureTime: string;
  carStateOfCharge: number;
  targetStateOfCharge: number;
}

