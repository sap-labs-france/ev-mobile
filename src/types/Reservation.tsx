import Car from './Car';
import ChargingStation from './ChargingStation';
import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import Tag from './Tag';
import User from './User';

export default interface Reservation extends CreatedUpdatedProps, ListItem {
  id: number;
  chargingStationID: string;
  chargingStation?: ChargingStation;
  connectorID: number;
  fromDate?: Date;
  toDate?: Date;
  expiryDate: Date;
  arrivalTime?: Date;
  departureTime?: Date;
  idTag: string;
  visualTagID?: string;
  tag?: Tag;
  parentIdTag?: string;
  carID?: string;
  car?: Car;
  userID?: string;
  user?: User;
  type: ReservationType;
  status?: ReservationStatusEnum;
  canUpdate?: boolean;
  canDelete?: boolean;
  canCancelReservation?: boolean;
}

export enum ReservationStatus {
  DONE = 'reservation_done',
  SCHEDULED = 'reservation_scheduled',
  IN_PROGRESS = 'reservation_in_progress',
  CANCELLED = 'reservation_cancelled',
  EXPIRED = 'reservation_expired',
  UNMET = 'reservation_unmet'
}

export enum ReservationType {
  PLANNED_RESERVATION = 'planned_reservation',
  RESERVE_NOW = 'reserve_now'
}

export type ReservationStatusEnum = ReservationStatus;

export type ReservationStatusTransition = Readonly<{
  from?: ReservationStatusEnum;
  to: ReservationStatusEnum;
}>;
