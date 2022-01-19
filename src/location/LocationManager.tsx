import RNLocation, { Location, Subscription } from 'react-native-location';

import Utils from '../utils/Utils';

export default class LocationManager {
  private static instance: LocationManager;
  private granted = false;
  private locationSubscription: Subscription;
  private currentLocation: Location;

  private constructor() {
    RNLocation.configure({
      distanceFilter: 100, // Meters
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy'
      },
      // Android only
      androidProvider: 'auto',
      interval: 5000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
      // iOS Only
      activityType: 'other',
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: 'portrait',
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true
    });
  }

  public static async getInstance(): Promise<LocationManager> {
    if (!LocationManager.instance) {
      LocationManager.instance = new LocationManager();
    }
    // Check
    LocationManager.instance.granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine'
      }
    });
    return LocationManager.instance;
  }

  public startListening() {
    if (this.granted) {
      this.locationSubscription = RNLocation.subscribeToLocationUpdates((locations: Location[]) => {
        if (!Utils.isEmptyArray(locations)) {
          // Sort DESC
          locations = locations.sort((location1: Location, location2: Location) => location2.timestamp - location1.timestamp);
          // Take the first one
          this.currentLocation = locations[0];
        }
      });
    }
  }

  public stopListening() {
    if (this.locationSubscription) {
      this.locationSubscription = null; // Must be a method to call in location
    }
  }

  public getLocation(): Location {
    return this.currentLocation;
  }
}
