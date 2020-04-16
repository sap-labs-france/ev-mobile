
export default interface Consumption {
  date: Date;
  instantPower: number;
  cumulatedConsumption: number;
  stateOfCharge: number;
  cumulatedAmount: number;
  limitWatts: number;
}
