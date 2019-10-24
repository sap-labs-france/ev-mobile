export interface DataResult<T> {
  count: number;
  result: T[];
}

export interface TransactionDataResult<T> {
  count: number;
  result: T[];
  stats: {
    count: number;
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

