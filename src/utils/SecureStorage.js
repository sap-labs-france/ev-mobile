import Constants from "./Constants";
import SInfo from "react-native-sensitive-info";

export default class SecureStorage {
  static async getUserCredentials() {
    const credentials = await SInfo.getItem(Constants.KEY_CREDENTIALS, {});
    // Check
    if (credentials) {
      return JSON.parse(credentials);
    } else {
      return {};
    }
  }

  static async clearUserCredentials() {
    // Clear only the token
    let credentials = await SInfo.getItem(Constants.KEY_CREDENTIALS, {});
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
    await SInfo.deleteItem(Constants.KEY_CREDENTIALS, {});
  }

  static async saveUserCredentials(credentials) {
    // Store User/Password/Token/tenant
    SInfo.setItem(Constants.KEY_CREDENTIALS, JSON.stringify(credentials), {});
  }
}