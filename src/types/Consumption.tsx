
export default interface Consumption {
  date: Date;
  instantWatts: number;
  instantAmps: number;
  limitWatts: number;
  limitAmps: number;
  cumulatedConsumptionWh: number;
  cumulatedConsumptionAmps: number;
  stateOfCharge: number;
  cumulatedAmount: number;
  voltage: number;
  voltageL1: number;
  voltageL2: number;
  voltageL3: number;
  voltageDC: number;
  amperage: number;
  amperageL1: number;
  amperageL2: number;
  amperageL3: number;
  amperageDC: number;
}
