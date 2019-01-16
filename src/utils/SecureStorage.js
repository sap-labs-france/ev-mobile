import Constants from "./Constants";
import SInfo from "react-native-sensitive-info";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";

// Clear old pass
SInfo.deleteItem(Constants.KEY_EMAIL, {});
SInfo.deleteItem(Constants.KEY_PASSWORD, {});
SInfo.deleteItem(Constants.KEY_TENANT, {});
SInfo.deleteItem(Constants.KEY_TOKEN, {});

export default class SecureStorage {
  static async getUserCredentials() {
    try {
      const credentials = await RNSecureStorage.get(Constants.KEY_CREDENTIALS);
      // Check
      if (credentials) {
        return JSON.parse(credentials);
      }
    } catch (err) {
      // Do nothing
    }
    return {};
  }

  static async clearUserCredentials() {
    try {
      // Clear only the token
      let credentials = await RNSecureStorage.get(Constants.KEY_CREDENTIALS);
      // Check
      if (credentials) {
        // Parse
        credentials = JSON.parse(credentials);
        // Clear token
        delete credentials.token;
        // Save
        SecureStorage.saveUserCredentials(credentials);
      }
    } catch (err) {
      // Do nothing
    }
  }

  static async deleteUserCredentials() {
    try {
      // Clear only the token
      RNSecureStorage.remove(Constants.KEY_CREDENTIALS);
    } catch (err) {
      // Do nothing
    }
  }

  static async saveUserCredentials(credentials) {
    // Store credentials
    RNSecureStorage.set(Constants.KEY_CREDENTIALS, JSON.stringify(credentials), {accessible: ACCESSIBLE.WHEN_UNLOCKED});
  }
}