import axios from "axios";
import Constants from "../utils/Constants";
import SInfo from "react-native-sensitive-info";

// const centralRestServerServiceBaseURL = 'https://192.168.1.130';
const centralRestServerServiceBaseURL = "https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com";
const centralRestServerServiceAuthURL = centralRestServerServiceBaseURL + "/client/auth";
const centralRestServerServiceSecuredURL = centralRestServerServiceBaseURL + "/client/api";
var jwtDecode = require("jwt-decode");

// Paste the tokken below
let _token;
let _decodedToken;
let _initialized;
let _email;
let _password;
let _tenant;

export default class  CentralServerProvider {
  async initialize() {
    // Only once
    if (!_initialized) {
      // Get stored data
      _email = await SInfo.getItem(Constants.KEY_EMAIL, {});
      _password = await SInfo.getItem(Constants.KEY_PASSWORD, {});
      _token = await SInfo.getItem(Constants.KEY_TOKEN, {});
      _tenant = await SInfo.getItem(Constants.KEY_TENANT, {});
      console.log(_token);
      // Check Token
      if (_token) {
        // Decode the token
        _decodedToken = jwtDecode(_token);
      }
      // Ok
      _initialized = true;
    }
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

  async getUserInfo() {
    // Init?
    await this.initialize();
    // Return
    return _decodedToken;
  }

  async resetPassword(email) {
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
    // Clear the token and tenant
    await SInfo.deleteItem(Constants.KEY_TOKEN, {});
    await SInfo.deleteItem(Constants.KEY_TENANT, {});
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
    let isUserAuthenticated =  await this.isUserAuthenticated();
    console.log("isUserAuth ?", isUserAuthenticated);
    console.log("email: ", _email);
    console.log("password: ", _password);
    console.log("tenant", _tenant);
    // Not authenticated ?
    if (!isUserAuthenticated) {
      // User not authenticated: email, password and tenant registered ?
      if (_email && _password && _tenant) {
        // Yes: Log user
        await this.login(_email, _password, true, _tenant);
        console.log("ReAuthenticated NEW TOKEN: ", _token);
      }
    }
  }

  async login(email, password, eula, tenant) {
    // Call
    let result = await axios.post(`${centralRestServerServiceAuthURL}/Login`, {
      email,
      password,
      "acceptEula": eula,
      tenant
    }, {
      headers: this._builHeaders()
    });
    console.log("Tenant login", tenant);
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
  }

  async register(name, firstName, email, passwords, eula) {
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
    // Call
    let result = await axios.get(`${centralRestServerServiceAuthURL}/EndUserLicenseAgreement`, {
      headers: this._builHeaders(),
      params
    });
    return result.data;
  }

  async startTransaction(chargeBoxID, connectorID) {
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
    console.log(result.data);
    return result.data;
  }

  async stopTransaction(chargeBoxID, transactionId) {
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
    console.log(result.data);
    return result.data;
  }

  async getTransaction(params = {}) {
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
    // Init ?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/Pricing`, {
      headers: this._builSecuredHeaders()
    });
    return result.data;
  }

  async getChargingStationConsumption(params = {}) {
    // Init ?
    await this.initialize();
    // Call
    let result = await axios.get(`${centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`, {
      headers: this._builSecuredHeaders(),
      params
    });
    return result.data;
  }

  async _isAdmin() {
    // Init?
    await this.initialize();
    // Check
    return (_decodedToken.role === Constants.ROLE_ADMIN);
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