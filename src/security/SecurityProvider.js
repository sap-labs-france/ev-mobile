
import Constants from "../utils/Constants";
const Authorization = require('node-authorization').Authorization;

const _debug = false;
export default class  SecurityProvider {

  constructor(decodedToken) {
    this.decodedToken = decodedToken;
  }

  isAdmin() {
    // Check
    return (this.decodedToken.role === Constants.ROLE_ADMIN);
  }

  isBasic() {
    // Check
    return (this.decodedToken.role === Constants.ROLE_BASIC);
  }

  canStartTransaction(chargingStation) {
    // Can perform stop?
    if (!this.canPerformActionOnChargingStation(
      this.decodedToken,
      chargingStation,
      Constants.ACTION_START_TRANSACTION)) {
      // Ko
      return false;
    }
    // Ok
    return true;
  }

  canPerformActionOnChargingStation(chargingStation, action) {
    // Check Charging Station
    const result = this.canPerformAction(Constants.ENTITY_CHARGING_STATION,
      {"Action": action, "ChargingStationID": chargingStation.id});

    // Return
    return result && this.checkChargingStationSite(this.decodedToken, chargingStation, Constants.ACTION_READ);
  }

  checkChargingStationSite(chargingStation, action) {
    // Check Site?
    if (chargingStation.siteArea) {
      // Yes
      return this.canPerformAction(Constants.ENTITY_SITE,
        {"Action": action, "SiteID": chargingStation.siteArea.siteID});
    } else {
      // No: Must be an admin
      return this.isAdmin();
    }
  }

  canPerformAction(entity, fieldNamesValues) {
    // Set debug mode?
    if (_debug) {
      // Switch on traces
      Authorization.switchTraceOn();
    }
    if (!this.authorizations) {
      this.authorizations = new Authorization(this.decodedToken.role, this.decodedToken.auths);
    }
    // Check
    if (this.authorizations.check(entity, fieldNamesValues)) {
      // Authorized!
      return true;
    } else {
      return false;
    }
  }
}