export default interface ChargingStationQRCode {
  tenantSubDomain: string;
  tenantName: string;
  tenantDescription: string;
  endpoint: 'aws' | 'scf';
  chargingStationID: string;
  connectorID: number;
}
