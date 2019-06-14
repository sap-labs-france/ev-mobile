import Constants from "./Constants";
import SInfo from "react-native-sensitive-info";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";

// Clear old pass
SInfo.deleteItem(Constants.KEY_EMAIL, {});
SInfo.deleteItem(Constants.KEY_PASSWORD, {});
SInfo.deleteItem(Constants.KEY_TENANT, {});
SInfo.deleteItem(Constants.KEY_TOKEN, {});

export default class SecuredStorage {
  static getUserCredentials() {
    return SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
  }

  static async clearUserCredentials() {
    // Clear only the token
    const credentials = await SecuredStorage._getJson(Constants.KEY_CREDENTIALS);
    // Check
    if (credentials) {
      // Clear token
      delete credentials.token;
      // Save
      SecuredStorage.saveUserCredentials(credentials);
    }
  }

  static async deleteUserCredentials() {
    // Clear only the token
    await RNSecureStorage.remove(Constants.KEY_CREDENTIALS);
  }

  static async saveUserCredentials(credentials) {
    // Store credentials
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
