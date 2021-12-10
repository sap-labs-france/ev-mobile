import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import User from './User';

export default interface Car extends CreatedUpdatedProps, ListItem {
  vin: string;
  licensePlate: string;
  carCatalog?: CarCatalog;
  user?: User;
  default: boolean;
  type?: CarType;
  converter?: CarConverter;
  carCatalogID: number;
  userID?: string;
  carConnectorData?: CarConnectorData;
  forced?: boolean;
}

export interface CarConnectorData {
  carConnectorID: string;
  carConnectorMeterID: string;
}

export interface CarCatalog extends ListItem {
  vehicleMake: string;
  vehicleModel: string;
  vehicleModelVersion?: string;
  image?: string;
  fastChargePowerMax?: number;
  batteryCapacityFull?: number;
  drivetrainPowerHP: number;
  performanceAcceleration: number;
  performanceTopspeed: number;
  rangeWLTP: number;
  rangeReal: number;
  efficiencyReal: number;
  chargePlug: string;
  chargeStandardPower: number;
  chargeStandardPhase: number;
  chargeStandardPhaseAmp: number;
  chargeAlternativePower: number;
  chargeAlternativePhase: number;
  chargeAlternativePhaseAmp: number;
  chargeOptionPower: number;
  chargeOptionPhase: number;
  chargeOptionPhaseAmp: number;
  fastChargePlug: string;
  canRead: boolean;
  canDelete: boolean;
  canUpdate: boolean;
}

export interface CarConverter {
  powerWatts: number;
  amperagePerPhase: number;
  numberOfPhases: number;
  type: CarConverterType;
}

export enum CarType {
  PRIVATE = 'P',
  COMPANY = 'C',
  POOL_CAR = 'PC'
}

export enum CarConverterType {
  STANDARD = 'S',
  OPTION = 'O',
  ALTERNATIVE = 'A'
}
