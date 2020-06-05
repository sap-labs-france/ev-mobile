
export default interface Consumption {
  date: Date;
  instantWatts: number;
  instantAmps: number;
  cumulatedConsumptionWh: number;
  cumulatedConsumptionAmps: number;
  stateOfCharge: number;
  cumulatedAmount: number;
  limitWatts: number;
  limitAmps: number;
}
