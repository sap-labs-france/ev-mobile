import Constants from "./Constants";
import SInfo from "react-native-sensitive-info";

// Clear old pass
SInfo.deleteItem(Constants.KEY_EMAIL, {});
SInfo.deleteItem(Constants.KEY_PASSWORD, {});
SInfo.deleteItem(Constants.KEY_TENANT, {});
SInfo.deleteItem(Constants.KEY_TOKEN, {});

const SECURED_STORE_PREFS = {
  sharedPreferencesName: Constants.SHARED_PREFERENCES_NAME,
  keychainService: Constants.KEYCHAIN_SERVICE,
  kSecAccessControl: "kSecAccessControlTouchIDCurrentSet",
  touchID: true
}

const STORE_PREFS = {
  sharedPreferencesName: Constants.SHARED_PREFERENCES_NAME,
  keychainService: Constants.KEYCHAIN_SERVICE
}

export default class SecureStorage {
  static async getUserCredentials() {
    const credentials = await SInfo.getItem(Constants.KEY_CREDENTIALS, STORE_PREFS);
    // Check
    if (credentials) {
      return JSON.parse(credentials);
    } else {
      return {};
    }
  }

  static async clearUserCredentials() {
    // Clear only the token
    let credentials = await SInfo.getItem(Constants.KEY_CREDENTIALS, STORE_PREFS);
    // Check
    if (credentials) {
      // Parse
      credentials = JSON.parse(credentials);
      // Clear token
      delete credentials.token;
      // Save
      SecureStorage.saveUserCredentials(credentials);
    }
  }

  static async deleteUserCredentials() {
    // Clear only the token
    await SInfo.deleteItem(Constants.KEY_CREDENTIALS, STORE_PREFS);
  }

  static async saveUserCredentials(credentials) {
    // Store User/Password/Token/tenant
    SInfo.setItem(Constants.KEY_CREDENTIALS, JSON.stringify(credentials), STORE_PREFS);
  }
}