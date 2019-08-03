import axios from "axios";
import Constants from "../utils/Constants";
import SecurityProvider from "./SecurityProvider";
import SecuredStorage from "../utils/SecuredStorage";
import jwtDecode from "jwt-decode";

const captchaBaseUrl = "https://evse.cfapps.eu10.hana.ondemand.com/";
let _centralRestServerServiceBaseURL = "https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com";
let _debug = false;
if (__DEV__) {
  // QA REST Server
  _centralRestServerServiceBaseURL = "https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com";
  _debug = true;
}
const _centralRestServerServiceAuthURL = _centralRestServerServiceBaseURL + "/client/auth";
const _centralRestServerServiceSecuredURL = _centralRestServerServiceBaseURL + "/client/api";
const _captchaSiteKey = "6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw";

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
  getCaptchaBaseUrl() {
    return captchaBaseUrl;
  }

  getCaptchaSiteKey() {
    return _captchaSiteKey;
  }

  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line class-methods-use-this
  debug(method) {
    if (_debug) {
      // eslint-disable-next-line no-console
      console.log(new Date().toISOString() + " - " + method);
    }
  }

  getTenant(subdomain) {
    return this.getTenants().find(tenant => tenant.subdomain === subdomain);
  }

  // eslint-disable-next-line class-methods-use-this
  getTenants() {
    return [
      { subdomain: "slf", name: "SAP Labs France" },
      { subdomain: "slfcah", name: "SAP Labs France (Charge@Home)" },
      { subdomain: "sapbelgium", name: "SAP Belgium" },
      { subdomain: "sapmarkdorf", name: "SAP Markdorf" },
      { subdomain: "sapnl", name: "SAP Netherland" }
    ];
  }

  async checkAndTriggerAutoLogin(navigation) {
    try {
      // Check if connection has expired
      if (await this.hasUserConnectionExpired()) {
        // Try to authenticate again
        await this.reAuthenticate();
      }
    } catch (error) {
      // Logoff
      await this.logoff();
      navigation.navigate("AuthNavigator");
    }
  }

  async hasUserConnectionExpired() {
    this.debug("hasUserConnectionExpired");
    return (await this.isUserConnected()) && !(await this.isUserConnectionValid());
  }

  async isUserConnected() {
    this.debug("isUserConnected");
    // Init?
    await this.initialize();
    // Check
    return !!_token;
  }

  async isUserConnectionValid() {
    this.debug("isUserConnectionValid");
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
      return true;
    }
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
    this.debug("reAuthenticate");
    // Check token
    if (!(await this.isUserConnectionValid())) {
      // User not authenticated: email, password and tenant registered ?
      if (_email && _password && _tenant) {
        // Yes: relog user
        await this.login(_email, _password, true, _tenant);
      }
    }
  }

  async login(email, password, acceptEula, tenant) {
    this.debug("login");
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceAuthURL}/Login`,
      {
        email,
        password,
        acceptEula,
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

  async register(tenant, name, firstName, email, passwords, acceptEula, captcha) {
    this.debug("register");
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceAuthURL}/RegisterUser`,
      {
        tenant,
        name,
        firstName,
        email,
        passwords,
        acceptEula,
        captcha
      },
      {
        headers: this._builHeaders()
      }
    );
    return result.data;
  }

  async retrievePassword(tenant, email, captcha) {
    this.debug("retrievePassword");
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceAuthURL}/Reset`,
      {
        tenant,
        email,
        captcha
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
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/Notifications`, {
      headers: this._buildSecuredHeaders(),
      params
    });
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
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/ChargingStations`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getCharger(params = {}) {
    this.debug("getCharger");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/ChargingStation`, {
      headers: this._buildSecuredHeaders(),
      params
    });
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
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/Sites`, {
      headers: this._buildSecuredHeaders(),
      params
    });
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
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/SiteAreas`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getEndUserLicenseAgreement(params = {}) {
    this.debug("getEndUserLicenseAgreement");
    // Call
    const result = await axios.get(`${_centralRestServerServiceAuthURL}/EndUserLicenseAgreement`, {
      headers: this._builHeaders(),
      params
    });
    return result.data;
  }

  async startTransaction(chargeBoxID, connectorID, tagID) {
    this.debug("startTransaction");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceSecuredURL}/ChargingStationStartTransaction`,
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
      `${_centralRestServerServiceSecuredURL}/ChargingStationStopTransaction`,
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

  async reset(chargeBoxID, type) {
    this.debug("rebootTransaction");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceSecuredURL}/ChargingStationReset`,
      {
        chargeBoxID,
        args: {
          type
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
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/Transaction`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getUserImage(params = {}) {
    this.debug("getUserImage");
    // Init?
    await this.initialize();
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/UserImage`, {
      headers: this._buildSecuredHeaders(),
      params
    });
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
      const result = await axios.get(`${_centralRestServerServiceSecuredURL}/SiteImage`, {
        headers: this._buildSecuredHeaders(),
        params: { ID: id }
      });
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
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/IsAuthorized`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getPrice() {
    this.debug("getPrice");
    // Init ?
    await this.initialize();
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/Pricing`, {
      headers: this._buildSecuredHeaders()
    });
    return result.data;
  }

  async getChargingStationConsumption(params = {}) {
    this.debug("getChargingStationConsumption");
    // Init ?
    await this.initialize();
    // Call
    const result = await axios.get(
      `${_centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`,
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

  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line class-methods-use-this
  _builHeaders() {
    return {
      "Content-Type": "application/json"
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _buildSecuredHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + _token
    };
  }
}
