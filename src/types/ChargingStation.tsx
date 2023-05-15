import CreatedUpdatedProps from './CreatedUpdatedProps';
import { KeyValue } from './Global';
import ListItem from './ListItem';
import SiteArea from './SiteArea';
import { InactivityStatus } from './Transaction';
import User from './User';

export enum Voltage {
  VOLTAGE_230 = 230,
  VOLTAGE_110 = 110
}

export default interface ChargingStation extends CreatedUpdatedProps, ListItem {
  id: string;
  siteAreaID: string;
  chargePointSerialNumber: string;
  chargePointModel: string;
  chargeBoxSerialNumber: string;
  chargePointVendor: string;
  iccid: string;
  imsi: string;
  meterType: string;
  firmwareVersion: string;
  meterSerialNumber: string;
  endpoint: string;
  ocppVersion: string;
  ocppProtocol: string;
  lastSeen: Date;
  deleted: boolean;
  inactive: boolean;
  lastReboot: Date;
  chargingStationURL: string;
  maximumPower: number;
  voltage: Voltage;
  powerLimitUnit: string;
  coordinates: number[];
  chargePoints: ChargePoint[];
  connectors: Connector[];
  currentIPAddress?: string;
  siteArea?: SiteArea;
  capabilities?: ChargingStationCapabilities;
  ocppStandardParameters?: KeyValue[];
  ocppVendorParameters?: KeyValue[];
  distanceMeters?: number;
}

export enum OCPPGeneralResponse {
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

export enum CurrentType {
  AC = 'AC',
  DC = 'DC'
}

export interface ChargePoint {
  chargePointID: number;
  currentType: CurrentType;
  voltage: Voltage;
  amperage: number;
  numberOfConnectedPhase: number;
  cannotChargeInParallel: boolean;
  sharePowerToAllConnectors: boolean;
  excludeFromPowerLimitation: boolean;
  ocppParamForPowerLimitation: string;
  power: number;
  efficiency: number;
  connectorIDs: number[];
}

export enum StaticLimitAmps {
  MIN_LIMIT_PER_PHASE = 6
}

export interface Connector {
  connectorId: number;
  currentInstantWatts: number;
  currentStateOfCharge?: number;
  currentTotalConsumptionWh?: number;
  currentTotalInactivitySecs?: number;
  currentInactivityStatus: InactivityStatus;
  currentTransactionID: number;
  currentTransactionDate: Date;
  currentTagID: string;
  currentUserID?: string;
  user?: User;
  status: ChargePointStatus;
  errorCode?: string;
  info?: string;
  vendorErrorCode?: string;
  power: number;
  type: ConnectorType;
  voltage?: Voltage;
  amperage?: number;
  amperageLimit?: number;
  statusLastChangedOn?: Date;
  numberOfConnectedPhase?: number;
  currentType?: CurrentType;
  chargePointID?: number;
  canReadTransaction?: boolean;
}

export enum ChargePointStatus {
  AVAILABLE = 'Available',
  PREPARING = 'Preparing',
  CHARGING = 'Charging',
  OCCUPIED = 'Occupied',
  SUSPENDED_EVSE = 'SuspendedEVSE',
  SUSPENDED_EV = 'SuspendedEV',
  FINISHING = 'Finishing',
  RESERVED = 'Reserved',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted'
}

export enum ConnectorType {
  TYPE_2 = 'T2',
  COMBO_CCS = 'CCS',
  CHADEMO = 'C',
  TYPE_1 = 'T1',
  TYPE_1_CCS = 'T1CCS',
  DOMESTIC = 'D',
  TYPE_3C = 'T3C',
  UNKNOWN = 'U'
}

export interface ChargingStationCapabilities {
  supportStaticLimitation?: boolean;
  supportChargingProfiles?: boolean;
  supportTxDefaultProfile?: boolean;
}

export interface OcppCommand {
  command: string;
  parameters: string[];
}

export enum SiteAreaLimitSource {
  CHARGING_STATIONS = 'CS',
  SITE_AREA = 'SA'
}

export enum ConnectorCurrentLimitSource {
  CHARGING_PROFILE = 'CP',
  STATIC_LIMITATION = 'SL',
  CONNECTOR = 'CO'
}
