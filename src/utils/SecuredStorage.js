import Constants from "./Constants";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import DeviceInfo from "react-native-device-info";

// Generate a new Id for persisting the navigation each time the app is launched first time
let navigationID = new Date().getTime();
if (__DEV__) {
  // Keep the same key for dev
  navigationID = "DEV_NAV_KEY";
}

export default class SecuredStorage {
  static async getNavigationState() {
    const navigationState = await SecuredStorage._getJson(Constants.KEY_NAVIGATION_STATE);
    // Check the key
    if (navigationState) {
      if (navigationState.key === navigationID) {
        return navigationState.navigationState;
      }
    }
    return null;
  }

  static async saveNavigationState(navigationState) {
    // Add a key
    navigationState = { key: navigationID, navigationState };
    await RNSecureStorage.set(Constants.KEY_NAVIGATION_STATE, JSON.stringify(navigationState), {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
  }

  static getUserCredentials() {
    return SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
  }

  static async clearUserCredentials() {
    const credentials = await SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
    if (credentials) {
      delete credentials.token;
      await SecuredStorage.saveUserCredentials(credentials);
    }
  }

  static async deleteUserCredentials() {
    await RNSecureStorage.remove(Constants.KEY_CREDENTIALS);
  }

  static async saveUserCredentials(credentials) {
    await RNSecureStorage.set(Constants.KEY_CREDENTIALS, JSON.stringify(credentials), {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
  }

  static async _getJson(key) {
    try {
      const data = await RNSecureStorage.get(key);
      // Check
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      // Do nothing
    }
    return null;
  }
}
