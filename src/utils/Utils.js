import Message from "./Message";
import I18n from "../I18n/I18n";
import validate from "validate.js";
import ProviderFactory from "../provider/ProviderFactory";

const _provider = ProviderFactory.getProvider();

export default class Utils {

  static async handleHttpUnexpectedError(error, props) {
    // Log in console
    console.log(error);
    // Check if HTTP?
    if (error.request) {
      // Status?
      switch (error.request.status) {
        // Backend not available
        case 0:
          Message.showError(I18n.t("general.cannotConnectBackend"));
          break;
        // Not logged in
        case 401:
          try {
            console.log("Trying to Authenticate");
            await _provider.reAuthenticate();
            console.log("Authenticated");
          } catch (errorLogin) {
            Message.showError("reAutentication failed");
            console.log(errorLogin);
            console.log("Authentication failed");
          }
          break;
          // Other errors
        default:
          Message.showError(I18n.t("general.unexpectedErrorBackend"));
          break;
      }
    } else {
      // Error in code
      Message.showError(I18n.t("general.unexpectedError"));
    }
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static validateInput(screen, constraints) {
    let formValid = true;
    const errorState = {};
    // Reset all
    for (const key in screen.state) {
      if (screen.state.hasOwnProperty(key)) {
        // Error?
        if (key.startsWith("error")) {
          // Clear
          let clearError = {};
          clearError[key] = null;
          screen.setState(clearError);
        }
      }
    }
    // Check
    let error = validate(screen.state, constraints);
    // Check for Errors
    if (error) {
      // Set in state the errors
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          // Set
          errorState["error" + Utils.capitalizeFirstLetter(key)] = error[key];
        }
      }
      formValid = false;
    }
    // Set
    screen.setState(errorState);
    // Return
    return formValid;
  }
}