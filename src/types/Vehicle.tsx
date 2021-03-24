import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import User from './User';

export default interface Vehicle extends CreatedUpdatedProps, ListItem {
  vin: string;
  licensePlate: string;
  carCatalog?: CarCatalog;
  carUsers?: UserCar[];
  type?: CarType;
  converter?: CarConverter;
}

export interface CarCatalog {
  id: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleModelVersion?: string;
  image?: string;
  fastChargePowerMax?: number;
  batteryCapacityFull?: number;
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
  POOL_CAR = 'PC',
}

export interface UserCar {
  id?: string;
  user: User;
  carID: string;
  default?: boolean;
  owner?: boolean;
}

export enum CarConverterType {
  STANDARD = 'S',
  OPTION = 'O',
  ALTERNATIVE = 'A',
}
