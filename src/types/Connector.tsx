import { InactivityStatusLevel } from "./Transaction";

export default interface Connector {
  connectorId: number;
  currentConsumption: number;
  currentStateOfCharge?: number;
  totalInactivitySecs?: number;
  inactivityStatusLevel: InactivityStatusLevel;
  totalConsumption?: number;
  status: string;
  errorCode?: string;
  info?: string;
  vendorErrorCode?: string;
  power: number;
  type: string;
  voltage?: number;
  amperage?: number;
  activeTransactionID: number;
  activeTransactionDate: Date;
  activeTagID: string;
}
