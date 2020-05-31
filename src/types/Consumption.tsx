
export default interface Consumption {
  date: Date;
  instantPower: number;
  instantAmps: number;
  cumulatedConsumption: number;
  cumulatedConsumptionAmps: number;
  stateOfCharge: number;
  cumulatedAmount: number;
  limitWatts: number;
  limitAmps: number;
}
