import Transaction from "./Transaction";

export interface DataResult<T> {
  count: number;
  result: T[];
}

export interface TransactionDataResult {
  count: number;
  result: Transaction[];
  stats: {
    count: number;
    firstTimestamp?: Date;
    lastTimestamp?: Date;
    totalConsumptionWattHours: number;
    totalDurationSecs: number;
    totalInactivitySecs: number;
    totalPrice: number;
  }
}

export interface ImageResult {
  id: string;
  image: string;
}

export interface LogoResult {
  id: string;
  logo: string;
}

