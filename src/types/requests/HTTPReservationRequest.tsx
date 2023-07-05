import { ReservationStatusEnum, ReservationType } from '../Reservation';

export interface HttpReservationGetRequest {
  WithUser?: boolean;
  WithChargingStation?: boolean;
  WithCar?: boolean;
  WithTag?: boolean;
}

export interface HttpReservationsGetRequest {
  Search: string;
  ReservationID: string;
  ChargingStationID: string;
  ConnectorID: string;
  UserID: string;
  CarID: string;
  SiteID: string;
  SiteAreaID: string;
  CompanyID: string;
  StartDateTime: Date;
  EndDateTime: Date;
  Status: ReservationStatusEnum;
  Type: ReservationType;
  WithUser: boolean;
  WithChargingStation: boolean;
  WithCar: boolean;
  WithTag: boolean;
  WithCompany: boolean;
  WithSite: boolean;
  WithSiteArea: boolean;
}

export interface HttpReservationCreateRequest {
  id: number;
  chargingStationID: string;
  connectorID: number;
  fromDate: Date;
  toDate: Date;
  expiryDate: Date;
  arrivalTime?: Date;
  idTag: string;
  visualTagID: string;
  parentIdTag?: string;
  userID?: string;
  carID?: string;
  type: ReservationType;
  status?: ReservationStatusEnum;
}

export interface HttpReservationUpdateRequest {
  id: number;
  chargingStationID: string;
  connectorID: number;
  fromDate: Date;
  toDate: Date;
  expiryDate: Date;
  arrivalTime?: Date;
  idTag: string;
  visualTagID: string;
  parentIdTag?: string;
  userID?: string;
  carID?: string;
  type: ReservationType;
  status?: ReservationStatusEnum;
}

export interface HttpReservationDeleteRequest {
  ID: number;
}

export interface HttpReservationCancelRequest {
  ID: number;
  args: {
    chargingStationID: string;
    connectorID: number;
  };
}
