import axios from "axios";
import Constants from "../utils/Constants";
import SecurityProvider from "../security/SecurityProvider";
import SInfo from "react-native-sensitive-info";
const jwtDecode = require("jwt-decode");

// const centralRestServerServiceBaseURL = 'https://192.168.1.130';
const centralRestServerServiceBaseURL = "https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com";
const centralRestServerServiceAuthURL = centralRestServerServiceBaseURL + "/client/auth";
const centralRestServerServiceSecuredURL = centralRestServerServiceBaseURL + "/client/api";

// Debug
const DEBUG = true;

// Paste the tokken below
let _token;
let _decodedToken;
let _initialized;
let _email;
let _password;
let _tenant;
let _securityProvider;
export default class  CentralServerProvider {
  async initialize() {
    // Only once
    if (!_initialized) {
      // Get stored data
      _email = await SInfo.getItem(Constants.KEY_EMAIL, {});
      _password = await SInfo.getItem(Constants.KEY_PASSWORD, {});
      _token = await SInfo.getItem(Constants.KEY_TOKEN, {});
      _tenant = await SInfo.getItem(Constants.KEY_TENANT, {});
      // Check Token
      if (_token) {
        // Decode the token
        _decodedToken = jwtDecode(_token);
        _securityProvider = new SecurityProvider(_decodedToken);
      }
      // Ok
      _initialized = true;
    }
  }

  debug(method) {
    if (DEBUG) {
      console.log( new Date().toISOString() + " - " + method);
    }
  }

  getLocation(tenant) {
    return this.getLocations().find((location) => location.subdomain === tenant);
  }

  getLocations() {
    return [
      { subdomain: "slf", name: "SAP Labs France"},
      { subdomain: "slfcah", name: "Charge@Home"},
    ]
  }

  async isUserAuthenticated() {
    // Init?
    await this.initialize();
    // Email and Password are mandatory
    if (!_email || !_password || !_tenant) {
      return false;
    }
    // Check Token
    if (_decodedToken) {
      // Check if expired
      if (_decodedToken.exp < (Date.now() / 1000)) {
        // Expired
        return false;
      }
      // Ok
      return true;
    }
    // No
    return false;
  }

  async getUserEmail() {
    // Init?
    await this.initialize();
    // Return
    return _email;
  }

  async getUserPassword() {
    // Init?
    await this.initialize();
    // Return
    return _password;
  }

  async getTenant() {
    // Init?
    await this.initialize();
    // Return
    return _tenant;
  }

  async getUserInfo() {
    // Init?
    await this.initialize();
    // Return
    return _decodedToken;
  }

  async resetPassword(email) {
    this.debug("resetPassword");
    // Init?
    await this.initialize();
    // Call
    await axios.post(`${centralRestServerServiceAuthURL}/Reset`, {
      email
    }, {
      headers: this._builHeaders()
    });
  }

  async logoff() {
    this.debug("logoff");
    // Clear the token and tenant
    await SInfo.deleteItem(Constants.KEY_TOKEN, {});
    // Clear local data
    _email = null;
    _password = null;
    _tenant = null;
    _token = null;
    _decodedToken = null;
    // Reload
    _initialized = false;
  }

  async reAuthenticate() {
    // Authenticated ?
    let isUserAuthenticated = await this.isUserAuthenticated();
    // Not authenticated ?
    if (!isUserAuthenticated) {
      // User not authenticated: email, password and tenant registered ?
      if (_email && _password && _tenant) {
        // Yes: Log user
        await this.login(_email, _password, true, _tenant);
      }
    }
  }

  async login(email, password, eula, tenant) {
    this.debug("login");
    // Call
    let result = await axios.post(`${centralRestServerServiceAuthURL}/Login`, {
      email,
      password,
      "acceptEula": eula,
      tenant
    }, {
      headers: this._builHeaders()
    });
    // Store User/Password/Token/tenant
    SInfo.setItem(Constants.KEY_EMAIL, email, {});
    SInfo.setItem(Constants.KEY_PASSWORD, password, {});
    SInfo.setItem(Constants.KEY_TOKEN, result.data.token, {});
    SInfo.setItem(Constants.KEY_TENANT, tenant, {});
    // Keep the token and tenant
    _token = result.data.token;
    _decodedToken = jwtDecode(_token);
    _tenant = tenant;
    _initialized = true;
    _securityProvider = new SecurityProvider(_decodedToken);
  }

  async register(name, firstName, email, passwords, eula) {
    this.debug("register");
    let result = await axios.post(`${centralRestServerServiceAuthURL}/RegisterUser`, {
      name,
      firstName,
      email,
      passwords,
      "acceptEula": eula
    }, {
      headers: this._builHeaders()
    });
    return result.data;
  }

  async getChargers(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getChargers");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/ChargingStations`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getCharger(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getCharger");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/ChargingStation`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSites(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getSites");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/Sites`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSiteAreas(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getSiteAreas");
    // Init?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/SiteAreas`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getEndUserLicenseAgreement(params = {}) {
    this.debug("getEndUserLicenseAgreement");
    // Call
    let result = await axios.get(`${centralRestServerServiceAuthURL}/EndUserLicenseAgreement`, {
      headers: this._builHeaders(),
      params
    });
    return result.data;
  }

  async startTransaction(chargeBoxID, connectorID) {
    this.debug("startTransaction");
    // Init?
    await this.initialize();
    // Call
    let result = await axios.post(`${centralRestServerServiceSecuredURL}/ChargingStationStartTransaction`, {
      chargeBoxID,
      "args": {
        "tagID": _decodedToken.tagIDs[0],
        connectorID
      }
    }, {
      headers: this._builSecuredHeaders()
    });
    return result.data;
  }

  async stopTransaction(chargeBoxID, transactionId) {
    this.debug("stopTransaction");
    // Init?
    await this.initialize();
    // Call
    let result = await axios.post(`${centralRestServerServiceSecuredURL}/ChargingStationStopTransaction`, {
      chargeBoxID,
      "args": {
        transactionId
      }
    }, {
      headers: this._builSecuredHeaders()
    });
    return result.data;
  }

  async getTransaction(params = {}) {
    this.debug("getTransaction");
    // Init?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/Transaction`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getUserImage(params = {}) {
    this.debug("getUserImage");
    // Init?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/UserImage`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSiteImage(params = {}) {
    this.debug("getSiteImage");
    // Init?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/SiteImage`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async isAuthorizedStopTransaction(params = {}) {
    this.debug("isAuthorizedStopTransaction");
    // Init ?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/IsAuthorized`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getPrice() {
    this.debug("getPrice");
    // Init ?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/Pricing`, {
      headers: this._builSecuredHeaders()
    });
    return result.data;
  }

  async getChargingStationConsumption(params = {}) {
    this.debug("getChargingStationConsumption");
    // Init ?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSecurityProvider() {
    // Init ?
    await this.initialize();
    // Return
    return _securityProvider;
  }

  _buildPaging(paging, queryString) {
    // Check
    if (paging) {
      // Limit
      if (paging.limit) {
        queryString.Limit = paging.limit;
      }
      // Skip
      if (paging.skip) {
        queryString.Skip = paging.skip;
      }
    }
  }

  _buildOrdering(ordering, queryString) {
    // Check
    if (ordering && ordering.length) {
      if (!queryString.SortFields) {
        queryString.SortFields = [];
        queryString.SortDirs = [];
      }
      // Set
      ordering.forEach((order) => {
        queryString.SortFields.push(order.field);
        queryString.SortDirs.push(order.direction);
      });
    }
  }

  _builHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Tenant": "slf"
    };
  }

  _builSecuredHeaders() {
    return {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + _token,
    };
  }
}