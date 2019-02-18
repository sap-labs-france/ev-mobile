import axios from "axios";
import Constants from "../utils/Constants";
import SecurityProvider from "../security/SecurityProvider";
import SecuredStorage from "../utils/SecuredStorage";
const jwtDecode = require("jwt-decode");

const centralRestServerServiceBaseURL =
  "https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com";
const centralRestServerServiceAuthURL =
  centralRestServerServiceBaseURL + "/client/auth";
const centralRestServerServiceSecuredURL =
  centralRestServerServiceBaseURL + "/client/api";

// Debug
const DEBUG = false;

// Paste the token below
let _token;
let _decodedToken;
let _initialized;
let _email;
let _password;
let _tenant;
let _securityProvider;
const _siteImages = [];

export default class CentralServerProvider {
  async initialize() {
    // Only once
    if (!_initialized) {
      // Get stored data
      const credentials = await SecuredStorage.getUserCredentials();
      if (credentials) {
        // Set
        _email = credentials.email;
        _password = credentials.password;
        _token = credentials.token;
        _tenant = credentials.tenant;
      } else {
        // Set
        _email = null;
        _password = null;
        _token = null;
        _tenant = null;
      }
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
      // eslint-disable-next-line no-console
      console.log(new Date().toISOString() + " - " + method);
    }
  }

  getTenant(tenantToFind) {
    return this.getTenants().find(tenant => tenant.subdomain === tenantToFind);
  }

  getTenants() {
    return [
      { subdomain: "slf", name: "SAP Labs France" },
      { subdomain: "slfcah", name: "Charge@Home" }
    ];
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
      if (_decodedToken.exp < Date.now() / 1000) {
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

  async getUserTenant() {
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
    await axios.post(
      `${centralRestServerServiceAuthURL}/Reset`,
      {
        email
      },
      {
        headers: this._builHeaders()
      }
    );
  }

  async logoff() {
    this.debug("logoff");
    // Clear the token and tenant
    await SecuredStorage.clearUserCredentials();
    // Clear local data
    _email = null;
    _password = null;
    _tenant = null;
    _token = null;
    _decodedToken = null;
    _initialized = false;
  }

  async reAuthenticate() {
    // Authenticated ?
    const isUserAuthenticated = await this.isUserAuthenticated();
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
    const result = await axios.post(
      `${centralRestServerServiceAuthURL}/Login`,
      {
        email,
        password,
        acceptEula: eula,
        tenant
      },
      {
        headers: this._builHeaders()
      }
    );
    // Save
    await SecuredStorage.saveUserCredentials({
      email,
      password,
      token: result.data.token,
      tenant
    });
    // Keep them
    _token = result.data.token;
    _decodedToken = jwtDecode(_token);
    _tenant = tenant;
    _initialized = true;
    _securityProvider = new SecurityProvider(_decodedToken);
  }

  async register(name, firstName, email, passwords, eula) {
    this.debug("register");
    const result = await axios.post(
      `${centralRestServerServiceAuthURL}/RegisterUser`,
      {
        name,
        firstName,
        email,
        passwords,
        acceptEula: eula
      },
      {
        headers: this._builHeaders()
      }
    );
    return result.data;
  }

  async getNotifications(
    params = {},
    paging = Constants.DEFAULT_PAGING,
    ordering = Constants.DEFAULT_ORDERING
  ) {
    this.debug("getNotifications");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/Notifications`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getChargers(
    params = {},
    paging = Constants.DEFAULT_PAGING,
    ordering = Constants.DEFAULT_ORDERING
  ) {
    this.debug("getChargers");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/ChargingStations`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getCharger(
    params = {},
    paging = Constants.DEFAULT_PAGING,
    ordering = Constants.DEFAULT_ORDERING
  ) {
    this.debug("getCharger");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/ChargingStation`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getSites(
    params = {},
    paging = Constants.DEFAULT_PAGING,
    ordering = Constants.DEFAULT_ORDERING
  ) {
    this.debug("getSites");
    // Init?
    await this.initialize();
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/Sites`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getSiteAreas(
    params = {},
    paging = Constants.DEFAULT_PAGING,
    ordering = Constants.DEFAULT_ORDERING
  ) {
    this.debug("getSiteAreas");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/SiteAreas`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getEndUserLicenseAgreement(params = {}) {
    this.debug("getEndUserLicenseAgreement");
    // Call
    const result = await axios.get(
      `${centralRestServerServiceAuthURL}/EndUserLicenseAgreement`,
      {
        headers: this._builHeaders(),
        params
      }
    );
    return result.data;
  }

  async startTransaction(chargeBoxID, connectorID, tagID) {
    this.debug("startTransaction");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.post(
      `${centralRestServerServiceSecuredURL}/ChargingStationStartTransaction`,
      {
        chargeBoxID,
        args: {
          tagID,
          connectorID
        }
      },
      {
        headers: this._buildSecuredHeaders()
      }
    );
    return result.data;
  }

  async stopTransaction(chargeBoxID, transactionId) {
    this.debug("stopTransaction");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.post(
      `${centralRestServerServiceSecuredURL}/ChargingStationStopTransaction`,
      {
        chargeBoxID,
        args: {
          transactionId
        }
      },
      {
        headers: this._buildSecuredHeaders()
      }
    );
    return result.data;
  }

  async getTransaction(params = {}) {
    this.debug("getTransaction");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/Transaction`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getUserImage(params = {}) {
    this.debug("getUserImage");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/UserImage`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getSiteImage(id) {
    this.debug("getSiteImage");
    // Init?
    await this.initialize();
    // Check cache
    let siteImage = _siteImages.find(siteImage => siteImage.id === id);
    if (!siteImage) {
      // Call
      const result = await axios.get(
        `${centralRestServerServiceSecuredURL}/SiteImage`,
        {
          headers: this._buildSecuredHeaders(),
          params: { ID: id }
        }
      );
      // Set
      siteImage = {
        id,
        data: result.data
      };
      // Add
      _siteImages.push(siteImage);
    }
    return siteImage.data;
  }

  async isAuthorizedStopTransaction(params = {}) {
    this.debug("isAuthorizedStopTransaction");
    // Init ?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/IsAuthorized`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  async getPrice() {
    this.debug("getPrice");
    // Init ?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/Pricing`,
      {
        headers: this._buildSecuredHeaders()
      }
    );
    return result.data;
  }

  async getChargingStationConsumption(params = {}) {
    this.debug("getChargingStationConsumption");
    // Init ?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`,
      {
        headers: this._buildSecuredHeaders(),
        params
      }
    );
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
      ordering.forEach(order => {
        queryString.SortFields.push(order.field);
        queryString.SortDirs.push(order.direction);
      });
    }
  }

  _builHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Tenant: "slf"
    };
  }

  _buildSecuredHeaders() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + _token
    };
  }
}
