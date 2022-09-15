
export enum DistanceUnit {
  KILOMETERS = 'kilometers',
  MILES = 'miles',
  AUTOMATIC = 'automatic'
}

export interface Settings {
  distanceUnit: DistanceUnit;
}
