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
let _email;
let _password;
let _tenant;
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
      // Try to decode the token
      try {
        // Decode the token
        _decodedToken = jwtDecode(_token);
        this.securityProvider = new SecurityProvider(_decodedToken);
      } catch (error) {}
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
    return this.getTenants().find((tenant) => tenant.subdomain === subdomain);
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

  async triggerAutoLogin(navigation, fctRefresh) {
    this.debug("triggerAutoLogin");
    try {
      // Force log the user
      await this.login(_email, _password, true, _tenant);
      // Ok: Refresh
      if (fctRefresh) {
        fctRefresh();
      }
    } catch (error) {
      // Ko: Logoff
      await this.logoff();
      // Go to login page
      if (navigation) {
        navigation.navigate("AuthNavigator");
      }
    }
  }

  hasUserConnectionExpired() {
    this.debug("hasUserConnectionExpired");
    return this.isUserConnected() && !this.isUserConnectionValid();
  }

  isUserConnected() {
    this.debug("isUserConnected");
    // Check
    return !!_token;
  }

  isUserConnectionValid() {
    this.debug("isUserConnectionValid");
    // Email and Password are mandatory
    if (!_email || !_password || !_tenant) {
      return false;
    }
    // Check Token
    if (_token) {
      try {
        // Try to decode the token
        _decodedToken = jwtDecode(_token);
      } catch (error) {
        return false;
      }
      // Check if expired
      if (_decodedToken) {
        if (_decodedToken.exp < Date.now() / 1000) {
          // Expired
          return false;
        }
        return true;
      }
    }
    return false;
  }

  getUserEmail() {
    return _email;
  }

  getUserPassword() {
    return _password;
  }

  getUserTenant() {
    return _tenant;
  }

  getUserInfo() {
    return _decodedToken;
  }

  logoff() {
    this.debug("logoff");
    // Clear the token and tenant
    SecuredStorage.clearUserCredentials();
    // Clear local data
    _token = null;
    _decodedToken = null;
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
    this.securityProvider = new SecurityProvider(_decodedToken);
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

  async getNotifications(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getNotifications");
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

  async getChargers(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getChargers");
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
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/ChargingStation`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSites(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getSites");
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

  async getSiteAreas(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getSiteAreas");
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
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceSecuredURL}/ChargingStationRemoteStartTransaction`,
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
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceSecuredURL}/ChargingStationRemoteStopTransaction`,
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
    this.debug("reset");
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

  async clearCache(chargeBoxID) {
    this.debug("clearCache");
    // Call
    const result = await axios.post(
      `${_centralRestServerServiceSecuredURL}/ChargingStationClearCache`,
      {
        chargeBoxID,
        args: {}
      },
      {
        headers: this._buildSecuredHeaders()
      }
    );
    return result.data;
  }

  async getTransaction(params = {}) {
    this.debug("getTransaction");
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/Transaction`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getTransactions(params = {}, paging = Constants.DEFAULT_PAGING, ordering = Constants.DEFAULT_ORDERING) {
    this.debug("getTransactions");
    // Build Paging
    this._buildPaging(paging, params);
    // Build Ordering
    this._buildOrdering(ordering, params);
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/TransactionsCompleted`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getUserImage(params = {}) {
    this.debug("getUserImage");
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/UserImage`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  async getSiteImage(id) {
    // Check cache
    let foundSiteImage = _siteImages.find((siteImage) => siteImage.id === id);
    if (!foundSiteImage) {
      this.debug("getSiteImage");
      // Call
      const result = await axios.get(`${_centralRestServerServiceSecuredURL}/SiteImage`, {
        headers: this._buildSecuredHeaders(),
        params: { ID: id }
      });
      // Set
      foundSiteImage = {
        id,
        image: result.data
      };
      // Add
      _siteImages.push(foundSiteImage);
    }
    return foundSiteImage.image;
  }

  async getPrice() {
    this.debug("getPrice");
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/Pricing`, {
      headers: this._buildSecuredHeaders()
    });
    return result.data;
  }

  async getChargingStationConsumption(params = {}) {
    this.debug("getChargingStationConsumption");
    // Call
    const result = await axios.get(`${_centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`, {
      headers: this._buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  getSecurityProvider() {
    return this.securityProvider;
  }

  // eslint-disable-next-line class-methods-use-this
  _buildPaging(paging, queryString) {
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
    if (ordering && ordering.length) {
      if (!queryString.SortFields) {
        queryString.SortFields = [];
        queryString.SortDirs = [];
      }
      ordering.forEach((order) => {
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
