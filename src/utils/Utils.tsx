import I18n from 'i18n-js';
import CentralServerProvider from 'provider/CentralServerProvider';
import { ImageSourcePropType, NativeModules, Platform } from 'react-native';
import { showLocation } from 'react-native-map-link';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import Address from 'types/Address';
import { KeyValue } from 'types/Global';
import validate from 'validate.js';

import chademo from '../../assets/connectorType/chademo.gif';
import combo from '../../assets/connectorType/combo_ccs.gif';
import domestic from '../../assets/connectorType/domestic-ue.gif';
import noConnector from '../../assets/connectorType/no-connector.gif';
import type2 from '../../assets/connectorType/type2.gif';
import I18nManager from '../I18n/I18nManager';
import commonColor from '../theme/variables/commonColor';
import ChargingStation, { ChargePoint, ChargePointStatus, Connector, ConnectorType, CurrentType } from '../types/ChargingStation';
import { RequestError } from '../types/RequestError';
import { InactivityStatus } from '../types/Transaction';
import User from '../types/User';
import Constants from './Constants';
import Message from './Message';

export default class Utils {
  public static canAutoLogin(centralServerProvider: CentralServerProvider, navigation: NavigationScreenProp<NavigationState, NavigationParams>): boolean {
    const tenantSubDomain = centralServerProvider.getUserTenant();
    const email = centralServerProvider.getUserEmail();
    const password = centralServerProvider.getUserPassword();
    return !centralServerProvider.hasAutoLoginDisabled() &&
      !Utils.isNullOrEmptyString(tenantSubDomain) &&
      !Utils.isNullOrEmptyString(email) &&
      !Utils.isNullOrEmptyString(password);
  }

  public static convertToInt(value: any): number {
    let changedValue: number = value;
    if (!value) {
      return 0;
    }
    // Check
    if (typeof value === 'string') {
      // Create Object
      changedValue = parseInt(value);
    }
    return changedValue;
  }

  public static formatAddress(address: Address): string {
    const addresses: string[] = [];
    if (address.address1 && address.address1.length > 0) {
      addresses.push(address.address1);
    }
    if (address.city && address.city.length > 0) {
      addresses.push(address.city);
    }
    return addresses.join(', ');
  }

  public static convertToFloat(value: any): number {
    let changedValue: number = value;
    if (!value) {
      return 0;
    }
    // Check
    if (typeof value === 'string') {
      // Create Object
      changedValue = parseFloat(value);
    }
    return changedValue;
  }

  public static convertToBoolean(value: any): boolean {
    let result = false;
    // Check boolean
    if (value) {
      // Check the type
      if (typeof value === 'boolean') {
        // Already a boolean
        result = value;
      } else {
        // Convert
        result = (value === 'true');
      }
    }
    return result;
  }

  public static convertToDate(date: any): Date {
    // Check
    if (!date) {
      return null;
    }
    // Check Type
    if (!(date instanceof Date)) {
      return new Date(date);
    }
    return date;
  }

  public static formatDistance(distanceMeters: number): string {
    let distance = distanceMeters;
    // Convert to Yard
    if (I18nManager.isMetricsSystem()) {
      distance *= 1.09361;
    }
    if (distance < 1000) {
      return I18nManager.isMetricsSystem() ?
        Math.round(distance) + ' m' :
        Math.round(distance) + ' yd';
    }
    return I18nManager.isMetricsSystem() ?
      I18nManager.formatNumber(Math.round(distance / 100) / 10) + ' km' :
      I18nManager.formatNumber(Math.round(distance * 0.000621371)) + ' mi';
  }

  public static isEmptyArray(array: any): boolean {
    if (!array) {
      return true;
    }
    if (Array.isArray(array) && array.length > 0) {
      return false;
    }
    return true;
  }

  public static jumpToMapWithAddress(title: string, address: Address) {
    if (!Utils.containsAddressGPSCoordinates(address)) {
      Message.showError(I18n.t('general.noGPSCoordinates'));
    } else {
      Utils.jumpToMapWithCoordinates(title, address.coordinates);
    }
  }

  public static jumpToMapWithCoordinates(title: string, coordinates: number[]) {
    if (!Utils.containsGPSCoordinates(coordinates)) {
      Message.showError(I18n.t('general.noGPSCoordinates'));
    } else {
      showLocation({
        longitude: coordinates[0],
        latitude: coordinates[1],
        title,
        googleForceLatLon: true,  // optionally force GoogleMaps to use the latlon for the query instead of the title
        alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
        dialogTitle: I18n.t('general.chooseApp'),
        dialogMessage: I18n.t('general.availableApps'),
        cancelText: I18n.t('general.close'),
      });
    }
  }

  public static getChargePointFromID(chargingStation: ChargingStation, chargePointID: number): ChargePoint {
    return chargingStation.chargePoints.find((chargePoint) => chargePoint.chargePointID === chargePointID);
  }

  public static getConnectorFromID(chargingStation: ChargingStation, connectorID: number): Connector {
    return chargingStation.connectors.find((connector) => connector.connectorId === connectorID);
  }

  public static containsAddressGPSCoordinates(address: Address): boolean {
      // Check if GPS are available
    if (address && Utils.containsGPSCoordinates(address.coordinates)) {
      return true;
    }
    return false;
  }

  public static containsGPSCoordinates(coordinates: number[]): boolean {
    // Check if GPs are available
    if (coordinates && coordinates.length === 2 && coordinates[0] && coordinates[1]) {
      // Check Longitude & Latitude
      if (new RegExp(Constants.REGEX_VALIDATION_LONGITUDE).test(coordinates[0].toString()) &&
          new RegExp(Constants.REGEX_VALIDATION_LATITUDE).test(coordinates[1].toString())) {
        return true;
      }
    }
    return false;
  }

  public static computeChargingStationTotalAmps(chargingStation: ChargingStation): number {
    let totalAmps = 0;
    if (chargingStation) {
      // Check at Charging Station
      if (chargingStation.maximumPower) {
        return Utils.convertWattToAmp(chargingStation, null, 0, chargingStation.maximumPower);
      }
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePoint of chargingStation.chargePoints) {
          totalAmps += chargePoint.amperage;
        }
      }
      // Check at connector level
      if (totalAmps === 0 && chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          totalAmps += connector.amperage;
        }
      }
    }
    return totalAmps;
  }

  // tslint:disable-next-line: cyclomatic-complexity
  public static getChargingStationPower(chargingStation: ChargingStation, chargePoint: ChargePoint, connectorId = 0): number {
    let totalPower = 0;
    if (chargingStation) {
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePointOfCS of chargingStation.chargePoints) {
          if (!chargePoint || chargePoint.chargePointID === chargePointOfCS.chargePointID) {
            // Charging Station
            if (connectorId === 0 && chargePointOfCS.power) {
              totalPower += chargePointOfCS.power;
              // Connector
            } else if (chargePointOfCS.connectorIDs.includes(connectorId) && chargePointOfCS.power) {
              if (chargePointOfCS.cannotChargeInParallel || chargePointOfCS.sharePowerToAllConnectors) {
                // Check Connector ID
                const connector = Utils.getConnectorFromID(chargingStation, connectorId);
                if (connector.power) {
                  return connector.power;
                }
                return chargePointOfCS.power;
              }
              // Power is shared evenly on connectors
              return chargePointOfCS.power / chargePointOfCS.connectorIDs.length;
            }
          }
        }
      }
      // Check at connector level
      if (totalPower === 0 && chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          if (connectorId === 0 && connector.power) {
            totalPower += connector.power;
          }
          if (connector.connectorId === connectorId && connector.power) {
            return connector.power;
          }
        }
      }
    }
    if (!totalPower) {
      const amperage = Utils.getChargingStationAmperage(chargingStation, chargePoint, connectorId);
      const voltage = Utils.getChargingStationVoltage(chargingStation, chargePoint, connectorId);
      if (voltage && amperage) {
        return voltage * amperage;
      }
    }
    return totalPower;
  }

  public static getNumberOfConnectedPhases(chargingStation: ChargingStation, chargePoint?: ChargePoint, connectorId = 0): number {
    if (chargingStation) {
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePointOfCS of chargingStation.chargePoints) {
          if (!chargePoint || chargePoint.chargePointID === chargePointOfCS.chargePointID) {
            // Charging Station
            if (connectorId === 0 && chargePointOfCS.numberOfConnectedPhase) {
              return chargePointOfCS.numberOfConnectedPhase;
            }
            // Connector
            if (chargePointOfCS.connectorIDs.includes(connectorId) && chargePointOfCS.numberOfConnectedPhase) {
              // Check Connector ID
              const connector = Utils.getConnectorFromID(chargingStation, connectorId);
              if (connector.numberOfConnectedPhase) {
                return connector.numberOfConnectedPhase;
              }
              return chargePointOfCS.numberOfConnectedPhase;
            }
          }
        }
      }
      // Check at connector level
      if (chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          // Take the first
          if (connectorId === 0 && connector.numberOfConnectedPhase) {
            return connector.numberOfConnectedPhase;
          }
          if (connector.connectorId === connectorId && connector.numberOfConnectedPhase) {
            return connector.numberOfConnectedPhase;
          }
        }
      }
    }
    return 1;
  }

  public static getChargingStationVoltage(chargingStation: ChargingStation, chargePoint?: ChargePoint, connectorId = 0): number {
    if (chargingStation) {
      // Check at charging station level
      if (chargingStation.voltage) {
        return chargingStation.voltage;
      }
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePointOfCS of chargingStation.chargePoints) {
          if (!chargePoint || chargePoint.chargePointID === chargePointOfCS.chargePointID) {
            // Charging Station
            if (connectorId === 0 && chargePointOfCS.voltage) {
              return chargePointOfCS.voltage;
            }
            // Connector
            if (chargePointOfCS.connectorIDs.includes(connectorId) && chargePointOfCS.voltage) {
              // Check Connector ID
              const connector = Utils.getConnectorFromID(chargingStation, connectorId);
              if (connector.voltage) {
                return connector.voltage;
              }
              return chargePointOfCS.voltage;
            }
          }
        }
      }
      // Check at connector level
      if (chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          // Take the first
          if (connectorId === 0 && connector.voltage) {
            return connector.voltage;
          }
          if (connector.connectorId === connectorId && connector.voltage) {
            return connector.voltage;
          }
        }
      }
    }
    return 0;
  }

  public static getChargingStationCurrentType(chargingStation: ChargingStation, chargePoint: ChargePoint, connectorId = 0): CurrentType {
    if (chargingStation) {
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePointOfCS of chargingStation.chargePoints) {
          if (!chargePoint || chargePoint.chargePointID === chargePointOfCS.chargePointID) {
            // Charging Station
            if (connectorId === 0 && chargePointOfCS.currentType) {
              return chargePointOfCS.currentType;
              // Connector
            } else if (chargePointOfCS.connectorIDs.includes(connectorId) && chargePointOfCS.currentType) {
              // Check Connector ID
              const connector = Utils.getConnectorFromID(chargingStation, connectorId);
              if (connector.currentType) {
                return connector.currentType;
              }
              return chargePointOfCS.currentType;
            }
          }
        }
      }
      // Check at connector level
      if (chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          // Take the first
          if (connectorId === 0 && connector.currentType) {
            return connector.currentType;
          }
          if (connector.connectorId === connectorId && connector.currentType) {
            return connector.currentType;
          }
        }
      }
    }
    return null;
  }

  // tslint:disable-next-line: cyclomatic-complexity
  public static getChargingStationAmperage(chargingStation: ChargingStation, chargePoint?: ChargePoint, connectorId = 0): number {
    let totalAmps = 0;
    if (chargingStation) {
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePointOfCS of chargingStation.chargePoints) {
          if (!chargePoint || chargePoint.chargePointID === chargePointOfCS.chargePointID) {
            // Charging Station
            if (connectorId === 0 && chargePointOfCS.amperage) {
              totalAmps += chargePointOfCS.amperage;
            } else if (chargePointOfCS.connectorIDs.includes(connectorId) && chargePointOfCS.amperage) {
              if (chargePointOfCS.cannotChargeInParallel || chargePointOfCS.sharePowerToAllConnectors) {
                // Same power for all connectors
                // Check Connector ID first
                const connector = Utils.getConnectorFromID(chargingStation, connectorId);
                if (connector.amperage) {
                  return connector.amperage;
                }
                return chargePointOfCS.amperage;
              }
              // Power is split evenly per connector
              return chargePointOfCS.amperage / chargePointOfCS.connectorIDs.length;
            }
          }
        }
      }
      // Check at connector level
      if (totalAmps === 0 && chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          if (connectorId === 0 && connector.amperage) {
            totalAmps += connector.amperage;
          }
          if (connector.connectorId === connectorId && connector.amperage) {
            return connector.amperage;
          }
        }
      }
    }
    return totalAmps;
  }

  public static getChargingStationAmperageLimit(chargingStation: ChargingStation, chargePoint: ChargePoint, connectorId = 0): number {
    let amperageLimit = 0;
    if (chargingStation) {
      if (connectorId > 0) {
        return Utils.getConnectorFromID(chargingStation, connectorId).amperageLimit;
      }
      // Check at charge point level
      if (chargingStation.chargePoints) {
        for (const chargePointOfCS of chargingStation.chargePoints) {
          if (!chargePoint || chargePoint.chargePointID === chargePointOfCS.chargePointID) {
            if (chargePointOfCS.excludeFromPowerLimitation) {
              continue;
            }
            if (chargePointOfCS.cannotChargeInParallel ||
              chargePointOfCS.sharePowerToAllConnectors) {
              // Add limit amp of one connector
              amperageLimit += Utils.getConnectorFromID(chargingStation, chargePointOfCS.connectorIDs[0]).amperageLimit;
            } else {
              // Add limit amp of all connectors
              for (const connectorID of chargePointOfCS.connectorIDs) {
                amperageLimit += Utils.getConnectorFromID(chargingStation, connectorID).amperageLimit;
              }
            }
          }
        }
      }
      // Check at connector level
      if (amperageLimit === 0 && chargingStation.connectors) {
        for (const connector of chargingStation.connectors) {
          amperageLimit += connector.amperageLimit;
        }
      }
    }
    return amperageLimit;
  }

  public static convertAmpToWatt(chargingStation: ChargingStation, chargePoint: ChargePoint, connectorID = 0, ampValue: number): number {
    const voltage = Utils.getChargingStationVoltage(chargingStation, chargePoint, connectorID);
    if (voltage) {
      return voltage * ampValue;
    }
    return 0;
  }

  public static convertWattToAmp(chargingStation: ChargingStation, chargePoint: ChargePoint, connectorID = 0, wattValue: number): number {
    const voltage = Utils.getChargingStationVoltage(chargingStation, chargePoint, connectorID);
    if (voltage) {
      return Math.floor(wattValue / voltage);
    }
    return 0;
  }

  public static getRoundedNumberToTwoDecimals(numberToRound: number): number {
    return Math.round(numberToRound * 100) / 100;
  }

  public static countJsonProps(jsonDoc: object): number {
    let count = 0;
    if (!jsonDoc) {
      return count;
    }
    for (const property in jsonDoc) {
      if (jsonDoc.hasOwnProperty(property)) {
        count++;
      }
    }
    return count;
  }

  public static cloneJSonDocument(jsonDocument: object): object {
    return JSON.parse(JSON.stringify(jsonDocument));
  }

  public static isNullOrEmptyString(value: string) {
    if (!value) {
      return true;
    }
    if (value.length === 0) {
      return true;
    }
    return false;
  }

  public static async sleep(millis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, millis));
  }

  public static getParamFromNavigation(navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    name: string, defaultValue: string): string {
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

  public static getLanguageFromLocale(locale: string) {
    let language = null;
    // Set the user's locale
    if (locale && locale.length >= 2) {
      language = locale.substring(0, 2);
    }
    return language;
  }

  private static getDeviceLocale(): string {
    return Platform.OS === 'ios' ?
      NativeModules.SettingsManager.settings.AppleLocale :
      NativeModules.I18nManager.localeIdentifier;
  }

  private static getDeviceLanguage(): string {
    return Utils.getLanguageFromLocale(Utils.getDeviceLocale());
  }

  public static getDeviceDefaultSupportedLocale(): string {
    const deviceLocale = Utils.getDeviceLocale();
    // Filter only on supported locales
    if (Constants.SUPPORTED_LOCALES.includes(deviceLocale)) {
      return deviceLocale;
    }
    return Constants.DEFAULT_LOCALE;
  }

  public static getDeviceDefaultSupportedLanguage(): string {
    const deviceLanguage = Utils.getDeviceLanguage();
    // Filter only on supported languages
    if (Constants.SUPPORTED_LANGUAGES.includes(deviceLanguage)) {
      return deviceLanguage;
    }
    return Constants.DEFAULT_LANGUAGE;
  }

  public static formatDuration(durationSecs: number): string {
    let result = '';
    if (durationSecs === 0) {
      return `0 ${I18n.t('general.second')}`;
    }
    const days = Math.floor(durationSecs / (3600 * 24));
    durationSecs -= days * 3600 * 24;
    const hours = Math.floor(durationSecs / 3600);
    durationSecs -= hours * 3600;
    const minutes = Math.floor(durationSecs / 60);
    const seconds = Math.floor(durationSecs - (minutes * 60));
    if (days !== 0) {
      result += `${days}${I18n.t('general.day')} `;
    }
    if (((hours !== 0) || (days !== 0)) && (hours !== 0 || (minutes !== 0 && days === 0))) {
      result += `${hours}${I18n.t('general.hour')} `;
    }
    if (days === 0) {
      if ((minutes !== 0) || (hours !== 0) && (minutes !== 0 || (seconds !== 0 && hours === 0))) {
        result += `${minutes}${I18n.t('general.minute')} `;
      }
      if ((hours === 0) && (seconds !== 0)) {
        result += `${seconds}${I18n.t('general.second')}`;
      }
    }
    return result;
  }

  public static computeInactivityStyle(inactivityStatus: InactivityStatus): object {
    switch (inactivityStatus) {
      case InactivityStatus.INFO:
        return { color: commonColor.brandSuccess };
      case InactivityStatus.WARNING:
        return { color: commonColor.brandWarning };
      case InactivityStatus.ERROR:
        return { color: commonColor.brandDanger };
      default:
        return { color: commonColor.brandInfo };
    }
  }

  public static sortArrayOfKeyValue(element1: KeyValue, element2: KeyValue) {
    // ignore upper and lowercase
    const keyA = element1.key.toUpperCase();
    const keyB = element2.key.toUpperCase();
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  }

  public static async handleHttpUnexpectedError(centralServerProvider: CentralServerProvider,
    error: RequestError, defaultErrorMessage: string, navigation?: NavigationScreenProp<NavigationState, NavigationParams>, fctRefresh?: () => void) {
    // Override
    fctRefresh = () => {
      setTimeout(() => fctRefresh, 2000);
    };
    // tslint:disable-next-line: no-console
    console.log(`HTTP request error`, error);
    // Check if HTTP?
    if (error.request) {
      // Status?
      switch (error.request.status) {
        // Backend not available
        case 0:
          Message.showError(I18n.t('general.cannotConnectBackend'));
          break;
        // Not logged in?
        case 401:
        case 403:
          // Force auto login
          await centralServerProvider.triggerAutoLogin(navigation, fctRefresh);
          break;
        // Other errors
        default:
          Message.showError(I18n.t(defaultErrorMessage ? defaultErrorMessage : 'general.unexpectedErrorBackend'));
          break;
      }
    } else if (error.name === 'InvalidTokenError') {
      // Force auto login
      await centralServerProvider.triggerAutoLogin(navigation, fctRefresh);
    } else {
      // Error in code
      Message.showError(I18n.t('general.unexpectedErrorBackend'));
    }
  }

  public static buildUserName(user: User): string {
    const userName = '-';
    // User?
    if (user) {
      // Firstname provided?
      if (user.name && user.firstName) {
        return `${user.name} ${user.firstName}`;
      } else {
        return `${user.name}`;
      }
    }
    return userName;
  }

  public static capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  public static validateInput(screen: React.Component, constraints: object): boolean {
    let formValid = true;
    const errorState: any = {};
    // Reset all errors
    for (const key in screen.state) {
      if (screen.state.hasOwnProperty(key)) {
        // Error?
        if (key.startsWith('error')) {
          // Clear
          const clearError: any = {};
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
          errorState['error' + Utils.capitalizeFirstLetter(key)] = error[key];
        }
      }
      formValid = false;
    }
    // Set
    screen.setState(errorState);
    // Return
    return formValid;
  }

  public static getConnectorLetterFromConnectorID(connectorID: number): string {
    if (!connectorID) {
      return '-';
    }
    return String.fromCharCode(65 + connectorID - 1);
  }

  public static getConnectorIDFromConnectorLetter(connectorLetter: string): number {
    if (!connectorLetter) {
      return 0;
    }
    return connectorLetter.charCodeAt(0) - 64;
  }

  public static randomNumber(): number {
    return Math.random() * 10000000;
  }

  public static translateConnectorStatus = (status: string): string => {
    switch (status) {
      case ChargePointStatus.AVAILABLE:
        return I18n.t('connector.available');
      case ChargePointStatus.CHARGING:
        return I18n.t('connector.charging');
      case ChargePointStatus.OCCUPIED:
        return I18n.t('connector.occupied');
      case ChargePointStatus.FAULTED:
        return I18n.t('connector.faulted');
      case ChargePointStatus.RESERVED:
        return I18n.t('connector.reserved');
      case ChargePointStatus.FINISHING:
        return I18n.t('connector.finishing');
      case ChargePointStatus.PREPARING:
        return I18n.t('connector.preparing');
      case ChargePointStatus.SUSPENDED_EVSE:
        return I18n.t('connector.suspendedEVSE');
      case ChargePointStatus.SUSPENDED_EV:
        return I18n.t('connector.suspendedEV');
      case ChargePointStatus.UNAVAILABLE:
        return I18n.t('connector.unavailable');
      default:
        return I18n.t('connector.unknown');
    }
  };

  public static translateConnectorType = (type: string): string => {
    switch (type) {
      case ConnectorType.TYPE_2:
        return I18n.t('connector.type2');
      case ConnectorType.COMBO_CCS:
        return I18n.t('connector.comboCCS');
      case ConnectorType.CHADEMO:
        return I18n.t('connector.chademo');
      case ConnectorType.DOMESTIC:
        return I18n.t('connector.domestic');
      default:
        return I18n.t('connector.unknown');
    }
  };

  public static getConnectorTypeImage = (type: ConnectorType): ImageSourcePropType => {
    switch (type) {
      case ConnectorType.TYPE_2:
        return type2;
      case ConnectorType.COMBO_CCS:
        return combo;
      case ConnectorType.CHADEMO:
        return chademo;
      case ConnectorType.DOMESTIC:
        return domestic;
      default:
        return noConnector;
    }
  };

  public static formatDurationHHMMSS = (durationSecs: number, withSecs: boolean = true): string => {
    if (durationSecs <= 0) {
      return withSecs ? Constants.DEFAULT_DURATION_WITH_SECS : Constants.DEFAULT_DURATION;
    }
    // Set Hours
    const hours = Math.trunc(durationSecs / 3600);
    durationSecs -= hours * 3600;
    // Set Mins
    let minutes = 0;
    if (durationSecs > 0) {
      minutes = Math.trunc(durationSecs / 60);
      durationSecs -= minutes * 60;
    }
    // Set Secs
    if (withSecs) {
      const seconds = Math.trunc(durationSecs);
      // Format
      return `${Utils.formatTimer(hours)}:${Utils.formatTimer(minutes)}:${Utils.formatTimer(seconds)}`;
    }
    // Format
    return `${Utils.formatTimer(hours)}:${Utils.formatTimer(minutes)}`;
  };

  private static formatTimer = (val: number): string => {
    // Put 0 next to the digit if lower than 10
    const valString = val + '';
    if (valString.length < 2) {
      return '0' + valString;
    }
    // Return new digit
    return valString;
  };
}
