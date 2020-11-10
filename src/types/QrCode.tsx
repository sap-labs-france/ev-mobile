export default interface ChargingStationQRCode {
  tenantSubDomain: string;
  tenantName: string;
  tenantDescription: string;
  endpoint: string;
  chargingStationID: string;
  connectorID: number;
}
