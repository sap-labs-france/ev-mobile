import { NavigationState } from "react-navigation";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import { UserCredentials } from "../types/User";
import Constants from "./Constants";

// Generate a new Id for persisting the navigation each time the app is launched first time
let navigationID: string = '' + new Date().getTime();
if (__DEV__) {
  // Keep the same key for dev
  navigationID = '123456789';
}

export default class SecuredStorage {
  public static async getNavigationState(): Promise<NavigationState> {
    const navigationState = await SecuredStorage._getJson(Constants.KEY_NAVIGATION_STATE);
    // Check the key
    if (navigationState) {
      if (navigationState.key === navigationID) {
        return navigationState.navigationState;
      }
    }
    return null;
  }

  public static async saveNavigationState(navigationState: NavigationState) {
    // Add a key
    await RNSecureStorage.set(
      Constants.KEY_NAVIGATION_STATE,
      JSON.stringify({ key: navigationID, navigationState }),
      { accessible: ACCESSIBLE.WHEN_UNLOCKED}
    );
  }

  public static getUserCredentials(): Promise<UserCredentials> {
    return SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
  }

  public static async clearUserToken() {
    const credentials = await SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
    if (credentials) {
      Reflect.deleteProperty(credentials, "token");
      await SecuredStorage.saveUserCredentials(credentials);
    }
  }

  public static async clearUserPassword() {
    const credentials: UserCredentials = await SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
    if (credentials) {
      Reflect.deleteProperty(credentials, "password");
      await SecuredStorage.saveUserCredentials(credentials);
    }
  }

  public static async deleteUserCredentials() {
    await RNSecureStorage.remove(Constants.KEY_CREDENTIALS);
  }

  public static async saveUserCredentials(credentials: UserCredentials) {
    await RNSecureStorage.set(Constants.KEY_CREDENTIALS, JSON.stringify(credentials), {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
  }

  private static async _getJson(key: string) {
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
