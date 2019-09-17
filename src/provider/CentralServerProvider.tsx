import axios from "axios";
import jwtDecode from "jwt-decode";
import { NavigationScreenProp, NavigationState, NavigationParams } from "react-navigation";
import Constants from "../utils/Constants";
import SecurityProvider from "./SecurityProvider";
import { ActionResponse } from "../types/ActionResponse";
import SecuredStorage from "../utils/SecuredStorage";
import Tenant from "../types/Tenant";
import UserToken from "../types/UserToken";
import PagingParams from "../types/PagingParams";
import ChargingStation from "../types/ChargingStation";
import Transaction from "../types/Transaction";
import Site from "../types/Site";
import SiteArea from "../types/SiteArea";
import Consumption from "../types/Consumption";

export default class CentralServerProvider {
  private debug: boolean = false;
  private captchaBaseUrl: string = "https://evse.cfapps.eu10.hana.ondemand.com/";
  private centralRestServerServiceBaseURL: string = "https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com";
  private centralRestServerServiceAuthURL: string = this.centralRestServerServiceBaseURL + "/client/auth";
  private centralRestServerServiceSecuredURL: string = this.centralRestServerServiceBaseURL + "/client/api";
  private captchaSiteKey: string = "6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw";

  // Paste the token below
  private token: string = null;
  private decodedToken: UserToken = null;
  private email: string = null;
  private password: string = null;
  private tenant: string = null;
  private siteImages: Array<{ id: string; image: string; }> = [];

  private securityProvider: SecurityProvider = null;

  constructor() {
    if (__DEV__) {
      // QA REST Server
      // this.centralRestServerServiceBaseURL = "https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com";
      this.debug = true;
    }
  }

  public getCaptchaBaseUrl(): string {
    return this.captchaBaseUrl;
  }

  public getCaptchaSiteKey(): string {
    return this.captchaSiteKey;
  }

  public getTenant(subdomain: string): Partial<Tenant> {
    return this.getTenants().find((tenant: Partial<Tenant>) => tenant.subdomain === subdomain);
  }

  // eslint-disable-next-line class-methods-use-this
  public getTenants(): Array<Partial<Tenant>> {
    return [
      { subdomain: "slf", name: "SAP Labs France" },
      { subdomain: "slfcah", name: "SAP Labs France (Charge@Home)" },
      { subdomain: "demo", name: "SAP Labs Demo" },
      { subdomain: "sapbelgium", name: "SAP Belgium" },
      { subdomain: "sapmarkdorf", name: "SAP Markdorf" },
      { subdomain: "sapnl", name: "SAP Netherland" },
    ];
  }

  public async triggerAutoLogin(
      navigation: NavigationScreenProp<NavigationState, NavigationParams>, fctRefresh: any) {
    this._debugMethod("triggerAutoLogin");
    try {
      // Force log the user
      await this.login(this.email, this.password, true, this.tenant);
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

  public hasUserConnectionExpired(): boolean {
    this._debugMethod("hasUserConnectionExpired");
    return this.isUserConnected() && !this.isUserConnectionValid();
  }

  public isUserConnected(): boolean {
    this._debugMethod("isUserConnected");
    return !!this.token;
  }

  public isUserConnectionValid(): boolean {
    this._debugMethod("isUserConnectionValid");
    // Email and Password are mandatory
    if (!this.email || !this.password || !this.tenant) {
      return false;
    }
    // Check Token
    if (this.token) {
      try {
        // Try to decode the token
        this.decodedToken = jwtDecode(this.token);
      } catch (error) {
        return false;
      }
      // Check if expired
      if (this.decodedToken) {
        if (this.decodedToken.exp < Date.now() / 1000) {
          // Expired
          return false;
        }
        return true;
      }
    }
    return false;
  }

  public getUserEmail(): string {
    return this.email;
  }

  public getUserPassword(): string {
    return this.password;
  }

  public getUserTenant(): string {
    return this.tenant;
  }

  public getUserInfo(): UserToken {
    return this.decodedToken;
  }

  public logoff() {
    this._debugMethod("logoff");
    // Clear the token and tenant
    SecuredStorage.clearUserCredentials();
    // Clear local data
    this.token = null;
    this.decodedToken = null;
  }

  public async login(email: string, password: string, acceptEula: boolean, tenant: string) {
    this._debugMethod("login");
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceAuthURL}/Login`,
      {
        acceptEula,
        email,
        password,
        tenant,
      },
      {
        headers: this._buildHeaders(),
      },
    );
    // Save
    await SecuredStorage.saveUserCredentials({
      email,
      password,
      tenant,
      token: result.data.token,
    });
    // Keep them
    this.email = email;
    this.password = password;
    this.token = result.data.token;
    this.decodedToken = jwtDecode(this.token);
    this.tenant = tenant;
    this.securityProvider = new SecurityProvider(this.decodedToken);
  }

  public async register(tenant: string, name: string, firstName: string, email: string,
                        passwords: {password: string; repeatPassword: string; }, acceptEula: boolean, captcha: string) {
    this._debugMethod("register");
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceAuthURL}/RegisterUser`,
      {
        acceptEula,
        captcha,
        email,
        firstName,
        name,
        passwords,
        tenant,
      },
      {
        headers: this._buildHeaders(),
      },
    );
    // Clear the token and tenant
    SecuredStorage.clearUserCredentials();
    // Save
    await SecuredStorage.saveUserCredentials({
      email,
      password: passwords.password,
      tenant,
    });
    // Keep them
    this.email = email;
    this.password = passwords.password;
    this.token = null;
    this.decodedToken = null;
    this.tenant = tenant;
    return result.data;
  }

  public async retrievePassword(tenant: string, email: string, captcha: string) {
    this._debugMethod("retrievePassword");
    const result = await axios.post(
      `${this.centralRestServerServiceAuthURL}/Reset`,
      {
        captcha,
        email,
        tenant,
      },
      {
        headers: this._buildHeaders(),
      },
    );
    return result.data;
  }

  public async getChargers(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<ChargingStation[]> {
    this._debugMethod("getChargers");
    // Build Paging
    this._buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStations`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getCharger(params = {}): Promise<ChargingStation> {
    this._debugMethod("getCharger");
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStation`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getSites(params = {}, paging = Constants.DEFAULT_PAGING): Promise<Site> {
    this._debugMethod("getSites");
    // Build Paging
    this._buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/Sites`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getSiteAreas(params = {}, paging = Constants.DEFAULT_PAGING): Promise<SiteArea[]> {
    this._debugMethod("getSiteAreas");
    // Build Paging
    this._buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/SiteAreas`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getEndUserLicenseAgreement(): Promise<string> {
    this._debugMethod("getEndUserLicenseAgreement");
    // Call
    const result = await axios.get(`${this.centralRestServerServiceAuthURL}/EndUserLicenseAgreement`, {
      headers: this._buildHeaders(),
    });
    return result.data;
  }

  public async startTransaction(chargeBoxID: string, connectorID: number, tagID: string): Promise<ActionResponse> {
    this._debugMethod("startTransaction");
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationRemoteStartTransaction`,
      {
        args: {
          connectorID,
          tagID,
        },
        chargeBoxID,
      },
      {
        headers: this._buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async stopTransaction(chargeBoxID: string, transactionId: number): Promise<ActionResponse> {
    this._debugMethod("stopTransaction");
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationRemoteStopTransaction`,
      {
        args: {
          transactionId,
        },
        chargeBoxID,
      },
      {
        headers: this._buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async reset(chargeBoxID: string, type: "soft"|"hard"): Promise<ActionResponse> {
    this._debugMethod("reset");
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationReset`,
      {
        args: {
          type,
        },
        chargeBoxID,
      },
      {
        headers: this._buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async clearCache(chargeBoxID: string): Promise<ActionResponse> {
    this._debugMethod("clearCache");
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationClearCache`,
      {
        args: {},
        chargeBoxID,
      },
      {
        headers: this._buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async getTransaction(params = {}): Promise<Transaction> {
    this._debugMethod("getTransaction");
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/Transaction`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getTransactions(params = {}, paging = Constants.DEFAULT_PAGING): Promise<Transaction[]> {
    this._debugMethod("getTransactions");
    // Build Paging
    this._buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/TransactionsCompleted`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getTransactionsActive(params = {}, paging = Constants.DEFAULT_PAGING): Promise<Transaction[]> {
    this._debugMethod("getTransactionsActive");
    // Build Paging
    this._buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/TransactionsActive`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getUserImage(params = {}): Promise<string> {
    this._debugMethod("getUserImage");
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/UserImage`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getSiteImage(id: string): Promise<string> {
    // Check cache
    let foundSiteImage = this.siteImages.find((siteImage) => siteImage.id === id);
    if (!foundSiteImage) {
      this._debugMethod("getSiteImage");
      // Call
      const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/SiteImage`, {
        headers: this._buildSecuredHeaders(),
        params: { ID: id },
      });
      // Set
      foundSiteImage = {
        id,
        image: result.data,
      };
      // Add
      this.siteImages.push(foundSiteImage);
    }
    return foundSiteImage.image;
  }

  public async getChargingStationConsumption(params = {}): Promise<Consumption[]> {
    this._debugMethod("getChargingStationConsumption");
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`, {
      headers: this._buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public getSecurityProvider(): SecurityProvider {
    return this.securityProvider;
  }

  private _buildPaging(paging: PagingParams, queryString: any) {
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

  // // eslint-disable-next-line class-methods-use-this
  // _buildOrdering(ordering, queryString) {
  //   if (ordering && ordering.length) {
  //     if (!queryString.SortFields) {
  //       queryString.SortFields = [];
  //       queryString.SortDirs = [];
  //     }
  //     ordering.forEach((order) => {
  //       queryString.SortFields.push(order.field);
  //       queryString.SortDirs.push(order.direction);
  //     });
  //   }
  // }

  private _buildHeaders(): object {
    return {
      "Content-Type": "application/json",
    };
  }

  private _buildSecuredHeaders(): object {
    return {
      "Authorization": "Bearer " + this.token,
      "Content-Type": "application/json",
    };
  }

  private _debugMethod(methodName: string) {
    if (this.debug) {
      // tslint:disable
      console.log(new Date().toISOString() + " - " + methodName);
    }
  }

  private async _initialize() {
    // Get stored data
    const credentials = await SecuredStorage.getUserCredentials();
    if (credentials) {
      // Set
      this.email = credentials.email;
      this.password = credentials.password;
      this.token = credentials.token;
      this.tenant = credentials.tenant;
    } else {
      // Set
      this.email = null;
      this.password = null;
      this.token = null;
      this.tenant = null;
    }
    // Check Token
    if (this.token) {
      // Try to decode the token
      try {
        // Decode the token
        this.decodedToken = jwtDecode(this.token);
        this.securityProvider = new SecurityProvider(this.decodedToken);
      } catch (error) {}
    }
  }
}
