import Message from "./Message";
import Constants from "./Constants";
import I18n from "../I18n/I18n";
import validate from "validate.js";
import { NativeModules, Platform } from 'react-native';
import ProviderFactory from "../provider/ProviderFactory";

const type2 = require("../../assets/connectorType/type2.gif");
const combo = require("../../assets/connectorType/combo_ccs.gif");
const chademo = require("../../assets/connectorType/chademo.gif");
const noConnector = require("../../assets/connectorType/no-connector.gif");

const _provider = ProviderFactory.getProvider();

export default class Utils {
  static getParamFromNavigation(navigation, name, defaultValue) {
    // Has param object?
    if (!navigation.state.params) {
      return defaultValue;
    }
    // Has param
    if (!navigation.state.params[name]) {
      return defaultValue;
    }
    // Ok, return the value
    return navigation.state.params[name];
  }

  static getLocale() {
    let deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale
        : NativeModules.I18nManager.localeIdentifier;
    // Filter only on supported languages
    const shortDeviceLanguage = deviceLanguage.substring(0, 2);
    if ((shortDeviceLanguage !== 'en') &&
        (shortDeviceLanguage !== 'fr')) {
      // Default
      deviceLanguage = "en-gb";
    }
    return deviceLanguage;
  }

  static getLocaleShort() {
    return Utils.getLocale().substring(0, 2);
  }

  static async handleHttpUnexpectedError(error, navigation) {
    // Log in console
    console.log({ error });
    // Check if HTTP?
    if (error.request) {
      // Status?
      switch (error.request.status) {
        // Backend not available
        case 0:
          Message.showError(I18n.t("general.cannotConnectBackend"));
          break;
        // Not logged in?
        case 401:
          // Try to auto login
          await _provider.checkAndTriggerAutoLogin(navigation);
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

  static buildUserName(user) {
    const userName = "-";
    // User?
    if (user) {
      // Firstname provided?
      if (user.name && user.firstName && `${user.name} ${user.firstName}`.length < 19) {
        return `${user.name} ${user.firstName}`;
      } else {
        return `${user.name}`;
      }
    }
    return userName;
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static validateInput(screen, constraints) {
    let formValid = true;
    const errorState = {};
    // Reset all errors
    for (const key in screen.state) {
      if (screen.state.hasOwnProperty(key)) {
        // Error?
        if (key.startsWith("error")) {
          // Clear
          const clearError = {};
          clearError[key] = null;
          screen.setState(clearError);
        }
      }
    }
    // Check for errors
    const error = validate(screen.state, constraints);
    // Check for Errors
    if (error) {
      // Set in state the errors
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
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

  static translateConnectorStatus = status => {
    switch (status) {
      case Constants.CONN_STATUS_AVAILABLE:
        return I18n.t("connector.available");
      case Constants.CONN_STATUS_CHARGING:
        return I18n.t("connector.charging");
      case Constants.CONN_STATUS_OCCUPIED:
        return I18n.t("connector.occupied");
      case Constants.CONN_STATUS_FAULTED:
        return I18n.t("connector.faulted");
      case Constants.CONN_STATUS_RESERVED:
        return I18n.t("connector.reserved");
      case Constants.CONN_STATUS_FINISHING:
        return I18n.t("connector.finishing");
      case Constants.CONN_STATUS_PREPARING:
        return I18n.t("connector.preparing");
      case Constants.CONN_STATUS_SUSPENDED_EVSE:
        return I18n.t("connector.suspendedEVSE");
      case Constants.CONN_STATUS_SUSPENDED_EV:
        return I18n.t("connector.suspendedEV");
      case Constants.CONN_STATUS_UNAVAILABLE:
        return I18n.t("connector.unavailable");
      default:
        return I18n.t("connector.unknown");
    }
  };

  static translateConnectorType = type => {
    switch (type) {
      case Constants.CONN_TYPE_2:
        return I18n.t("connector.type2");
      case Constants.CONN_TYPE_COMBO_CCS:
        return I18n.t("connector.comboCCS");
      case Constants.CONN_TYPE_CHADEMO:
        return I18n.t("connector.chademo");
      default:
        return I18n.t("connector.unknown");
    }
  };

  static getConnectorTypeImage = type => {
    switch (type) {
      case Constants.CONN_TYPE_2:
        return type2;
      case Constants.CONN_TYPE_COMBO_CCS:
        return combo;
      case Constants.CONN_TYPE_CHADEMO:
        return chademo;
      default:
        return noConnector;
    }
  };
}
