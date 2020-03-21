import axios from 'axios';
import jwtDecode from 'jwt-decode';
import NotificationManager from 'notification/NotificationManager';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import I18nManager from '../I18n/I18nManager';
import MigrationManager from '../migration/MigrationManager';
import { ActionResponse } from '../types/ActionResponse';
import ChargingStation, { ChargingStationConfiguration } from '../types/ChargingStation';
import { DataResult, TransactionDataResult } from '../types/DataResult';
import Eula, { EulaAccepted } from '../types/Eula';
import PagingParams from '../types/PagingParams';
import Setting from '../types/Setting';
import Site from '../types/Site';
import SiteArea from '../types/SiteArea';
import Tenant from '../types/Tenant';
import Transaction from '../types/Transaction';
import UserToken from '../types/UserToken';
import Constants from '../utils/Constants';
import SecuredStorage from '../utils/SecuredStorage';
import Utils from '../utils/Utils';
import SecurityProvider from './SecurityProvider';

export default class CentralServerProvider {
  private debug: boolean = false;
  private captchaBaseUrl: string = 'https://evse.cfapps.eu10.hana.ondemand.com';
  private centralRestServerServiceBaseURL: string = 'https://sap-ev-rest-server.cfapps.eu10.hana.ondemand.com';
  private centralRestServerServiceAuthURL: string = this.centralRestServerServiceBaseURL + '/client/auth';
  private centralRestServerServiceSecuredURL: string = this.centralRestServerServiceBaseURL + '/client/api';
  private captchaSiteKey: string = '6Lcmr6EUAAAAAIyn3LasUzk-0MpH2R1COXFYsxNw';

  // Paste the token below
  private token: string = null;
  private decodedToken: UserToken = null;
  private email: string = null;
  private password: string = null;
  private locale: string = null;
  private tenantSubDomain: string = null;
  private currency: string = null;
  private siteImages: {id: string; image: string;}[] = [];
  private autoLoginDisabled: boolean = false;
  private notificationManager: NotificationManager;

  private securityProvider: SecurityProvider = null;

  constructor() {
    if (__DEV__) {
      // QA REST Server
      this.centralRestServerServiceBaseURL = 'https://sap-ev-rest-server-qa.cfapps.eu10.hana.ondemand.com';
      this.centralRestServerServiceAuthURL = this.centralRestServerServiceBaseURL + '/client/auth';
      this.centralRestServerServiceSecuredURL = this.centralRestServerServiceBaseURL + '/client/api';
      this.debug = true;
      // Debug Axios
      axios.interceptors.request.use(request => {
        // tslint:disable-next-line: no-console
        console.log(new Date().toISOString() + ' - Axios - Request:', request)
        return request;
      });
      axios.interceptors.response.use(response => {
        // tslint:disable-next-line: no-console
        console.log(new Date().toISOString() + ' - Axios - Response:', response)
        return response;
      });
    }
  }

  public setNotificationManager(notificationManager: NotificationManager) {
    this.notificationManager = notificationManager;
  }

  public async initialize() {
    // Get stored data
    const credentials = await SecuredStorage.getUserCredentials(this.tenantSubDomain);
    if (credentials) {
      // Set
      this.email = credentials.email;
      this.password = credentials.password;
      this.token = credentials.token;
      this.tenantSubDomain = credentials.tenantSubDomain;
      this.locale = credentials.locale;
      this.currency = credentials.currency;
    } else {
      // Set
      this.email = null;
      this.password = null;
      this.token = null;
      this.tenantSubDomain = null;
      this.locale = null;
      this.currency = null;
    }
    // Check Token
    if (this.token) {
      // Try to decode the token
      try {
        // Decode the token
        this.decodedToken = jwtDecode(this.token);
        // Build Security Provider
        this.securityProvider = new SecurityProvider(this.decodedToken);
      } catch (error) {}
    }
    // Adjust the language according the last login info
    I18nManager.switchLanguage(this.getUserLanguage(), this.currency);
  }

  public getCaptchaBaseUrl(): string {
    return this.captchaBaseUrl;
  }

  public getCaptchaSiteKey(): string {
    return this.captchaSiteKey;
  }

  public getTenant(tenantSubDomain: string): Partial<Tenant> {
    return this.getTenants().find((tenant: Partial<Tenant>) => tenant.subdomain === tenantSubDomain);
  }

  // eslint-disable-next-line class-methods-use-this
  public getTenants(): Partial<Tenant>[] {
    if (__DEV__) {
      return [
        { subdomain: 'testcharger', name: 'Test Chargers' },
        { subdomain: 'slf', name: 'SAP Labs France' },
        { subdomain: 'slfcah', name: 'SAP Labs France (Charge@Home)' },
        { subdomain: 'proviridis', name: 'Proviridis' },
        { subdomain: 'demo', name: 'SAP Labs Demo' },
        { subdomain: 'sapbelgium', name: 'SAP Belgium' },
      ];
    }
    return [
      { subdomain: 'slf', name: 'SAP Labs France' },
      { subdomain: 'slfcah', name: 'SAP Labs France (Charge@Home)' },
      { subdomain: 'proviridis', name: 'Proviridis' },
      { subdomain: 'sapbelgium', name: 'SAP Belgium' },
    ];
  }

  public async triggerAutoLogin(
      navigation: NavigationScreenProp<NavigationState, NavigationParams>, fctRefresh: any) {
    this.debugMethod('triggerAutoLogin');
    try {
      // Force log the user
      await this.login(this.email, this.password, true, this.tenantSubDomain);
      // Ok: Refresh
      if (fctRefresh) {
        fctRefresh();
      }
    } catch (error) {
      // Ko: Logoff
      await this.logoff();
      // Go to login page
      if (navigation) {
        navigation.navigate('AuthNavigator');
      }
    }
  }

  public hasUserConnectionExpired(): boolean {
    this.debugMethod('hasUserConnectionExpired');
    return this.isUserConnected() && !this.isUserConnectionValid();
  }

  public isUserConnected(): boolean {
    this.debugMethod('isUserConnected');
    return !!this.token;
  }

  public isUserConnectionValid(): boolean {
    this.debugMethod('isUserConnectionValid');
    // Email and Password are mandatory
    if (!this.email || !this.password || !this.tenantSubDomain) {
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

  public async clearUserPassword() {
    await SecuredStorage.clearUserPassword(this.tenantSubDomain);
    this.password = null;
  }

  public getUserEmail(): string {
    return this.email;
  }

  public getUserCurrency(): string {
    return this.currency;
  }

  public getUserLocale(): string {
    if (this.locale) {
      return this.locale;
    }
    return Utils.getDefaultLocale();
  }

  public getUserLanguage(): string {
    if (this.locale) {
      return Utils.getLanguageFromLocale(this.locale);
    }
    return Utils.getDefaultLanguage();
  }

  public getUserPassword(): string {
    return this.password;
  }

  public getUserTenant(): string {
    return this.tenantSubDomain;
  }

  public getUserToken(): string {
    return this.token;
  }

  public getUserInfo(): UserToken {
    return this.decodedToken;
  }

  public hasAutoLoginDisabled(): boolean {
    return this.autoLoginDisabled;
  }

  public setAutoLoginDisabled(autoLoginDisabled: boolean) {
    this.autoLoginDisabled = autoLoginDisabled;
  }

  public logoff() {
    this.debugMethod('logoff');
    // Clear the token and tenant
    SecuredStorage.clearUserToken(this.tenantSubDomain);
    // Clear local data
    this.token = null;
    this.decodedToken = null;
  }

  public async login(email: string, password: string, acceptEula: boolean, tenantSubDomain: string) {
    this.debugMethod('login');
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceAuthURL}/Login`,
      {
        acceptEula,
        email,
        password,
        tenant: tenantSubDomain,
      },
      {
        headers: this.buildHeaders(),
      },
    );
    // Keep them
    this.email = email;
    this.password = password;
    this.token = result.data.token;
    this.decodedToken = jwtDecode(this.token);
    this.locale = this.decodedToken.locale;
    this.currency = this.decodedToken.currency;
    this.tenantSubDomain = tenantSubDomain;
    this.securityProvider = new SecurityProvider(this.decodedToken);
    this.autoLoginDisabled = false;
    // Save
    await SecuredStorage.saveUserCredentials(tenantSubDomain, {
      email,
      password,
      tenantSubDomain,
      token: result.data.token,
      locale: this.decodedToken.locale,
      currency: this.decodedToken.currency
    });
    // Adjust the language according the last login info
    I18nManager.switchLanguage(this.getUserLanguage(), this.currency);
    try {
      // Save the User's token
      await this.saveUserMobileToken({
        id: this.getUserInfo().id,
        mobileToken: this.notificationManager.getToken(),
        mobileOS: this.notificationManager.getOs()
      });
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log('Error saving Mobile Token:', error);
    }
    // Check migration for logged user
    const migrationManager = MigrationManager.getInstance();
    await migrationManager.migrate();
    // Check on hold notification
    this.notificationManager.checkOnHoldNotification();
  }

  public async register(tenantSubDomain: string, name: string, firstName: string, email: string,
                        passwords: {password: string; repeatPassword: string; }, acceptEula: boolean, captcha: string) {
    this.debugMethod('register');
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
        tenant: tenantSubDomain,
      },
      {
        headers: this.buildHeaders(),
      },
    );
    // Clear the token and tenant
    SecuredStorage.clearUserToken(tenantSubDomain);
    // Save
    await SecuredStorage.saveUserCredentials(tenantSubDomain, {
      email,
      password: passwords.password,
      tenantSubDomain,
    });
    // Keep them
    this.email = email;
    this.password = passwords.password;
    this.token = null;
    this.decodedToken = null;
    this.tenantSubDomain = tenantSubDomain;
    return result.data;
  }

  public async retrievePassword(tenantSubDomain: string, email: string, captcha: string) {
    this.debugMethod('retrievePassword');
    const result = await axios.post(
      `${this.centralRestServerServiceAuthURL}/Reset`,
      {
        tenant: tenantSubDomain,
        captcha,
        email,
      },
      {
        headers: this.buildHeaders(),
      },
    );
    return result.data;
  }

  public async resetPassword(tenantSubDomain: string, hash: string, passwords: {password: string; repeatPassword: string; }) {
    this.debugMethod('resetPassword');
    const result = await axios.post(
      `${this.centralRestServerServiceAuthURL}/Reset`,
      {
        tenant: tenantSubDomain,
        hash,
        passwords,
      },
      {
        headers: this.buildHeaders(),
      },
    );
    return result.data;
  }

  public async verifyEmail(tenantSubDomain: string, email: string, token: string): Promise<ActionResponse> {
    this.debugMethod('verifyEmail');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceAuthURL}/VerifyEmail`, {
      headers: this.buildHeaders(),
      params:{
        Tenant: tenantSubDomain,
        Email: email,
        VerificationToken: token
      },
    });
    return result.data;
  }

  public async getChargers(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<ChargingStation>> {
    this.debugMethod('getChargers');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStations`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async saveUserMobileToken(params: {id: string; mobileToken: string; mobileOS: string}): Promise<ActionResponse> {
    this.debugMethod('saveUserMobileToken');
    // Call
    const result = await axios.put(`${this.centralRestServerServiceSecuredURL}/UpdateUserMobileToken`, params, {
      headers: this.buildSecuredHeaders(),
    });
    return result.data;
  }

  public async getCharger(params = {}): Promise<ChargingStation> {
    this.debugMethod('getCharger');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStation`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getChargerConfiguration(id: string): Promise<ChargingStationConfiguration> {
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStationConfiguration?ChargeBoxID=${id}`, {
      headers: this.buildSecuredHeaders()
    });
    return result.data;
  }

  public async getSettings(params: {} = {}): Promise<DataResult<Setting>> {
    this.debugMethod('getCharger');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/Settings`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getSites(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<Site>> {
    this.debugMethod('getSites');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/Sites`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getSiteAreas(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<SiteArea>> {
    this.debugMethod('getSiteAreas');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/SiteAreas`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getEndUserLicenseAgreement(params: { Language: string; }): Promise<Eula> {
    this.debugMethod('getEndUserLicenseAgreement');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceAuthURL}/EndUserLicenseAgreement`, {
      headers: this.buildHeaders(),
      params
    });
    return result.data;
  }

  public async startTransaction(chargeBoxID: string, connectorId: number, tagID: string): Promise<ActionResponse> {
    this.debugMethod('startTransaction');
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationRemoteStartTransaction`,
      {
        args: {
          connectorId,
          tagID,
        },
        chargeBoxID,
      },
      {
        headers: this.buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async stopTransaction(chargeBoxID: string, transactionId: number): Promise<ActionResponse> {
    this.debugMethod('stopTransaction');
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
        headers: this.buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async reset(chargeBoxID: string, type: 'Soft'|'Hard'): Promise<ActionResponse> {
    this.debugMethod('reset');
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
        headers: this.buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async clearCache(chargeBoxID: string): Promise<ActionResponse> {
    this.debugMethod('clearCache');
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationClearCache`,
      {
        args: {},
        chargeBoxID,
      },
      {
        headers: this.buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async unlockConnector(chargeBoxID: string, connectorId: number): Promise<ActionResponse> {
    this.debugMethod('clearCache');
    // Call
    const result = await axios.post(
      `${this.centralRestServerServiceSecuredURL}/ChargingStationUnlockConnector`,
      {
        args: {
          connectorId
        },
        chargeBoxID
      },
      {
        headers: this.buildSecuredHeaders(),
      },
    );
    return result.data;
  }

  public async getTransaction(params = {}): Promise<Transaction> {
    this.debugMethod('getTransaction');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/Transaction`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getLastTransaction(chargeBoxID: string, connectorId: number): Promise<Transaction> {
    const params: { [param: string]: string } = {};
    params.ChargeBoxID = chargeBoxID;
    params.ConnectorId = connectorId + '';
    params.Limit = '1';
    params.Skip = '0';
    params.SortFields = 'timestamp';
    params.SortDirs = '-1';
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStationTransactions`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    if (result.data.count > 0) {
      return result.data.result[0];
    }
    return null;
  }

  public async getTransactions(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<TransactionDataResult> {
    this.debugMethod('getTransactions');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/TransactionsCompleted`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async requestChargingStationOCPPConfiguration(id: string): Promise<ActionResponse> {
    this.debugMethod('requestChargingStationOCPPConfiguration');
    // Call
    const result = await axios.post(`${this.centralRestServerServiceSecuredURL}/ChargingStationRequestConfiguration`,
      {
        chargeBoxID: id,
        forceUpdateOCPPParamsFromTemplate: false,
      }, {
        headers: this.buildSecuredHeaders(),
      }
    );
    return result.data;
  }

  public async getTransactionsActive(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<Transaction>> {
    this.debugMethod('getTransactionsActive');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/TransactionsActive`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async getUserImage(params = {}): Promise<string> {
    this.debugMethod('getUserImage');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/UserImage`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data.image;
  }

  public async getSiteImage(id: string): Promise<string> {
    this.debugMethod('getSiteImage');
    // Check cache
    let foundSiteImage = this.siteImages.find((siteImage) => siteImage.id === id);
    if (!foundSiteImage) {
      // Call
      const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/SiteImage`, {
        headers: this.buildSecuredHeaders(),
        params: { ID: id },
      });
      // Set
      foundSiteImage = {
        id,
        image: result.data.image,
      };
      // Add
      this.siteImages.push(foundSiteImage);
    }
    return foundSiteImage.image;
  }

  public async getTransactionWithConsumption(params = {}): Promise<Transaction> {
    this.debugMethod('getChargingStationConsumption');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceSecuredURL}/ChargingStationConsumptionFromTransaction`, {
      headers: this.buildSecuredHeaders(),
      params,
    });
    return result.data;
  }

  public async checkEndUserLicenseAgreement(params: {email: string, tenantSubDomain: string;}): Promise<EulaAccepted> {
    this.debugMethod('checkEndUserLicenseAgreement');
    // Call
    const result = await axios.get(`${this.centralRestServerServiceAuthURL}/CheckEndUserLicenseAgreement`, {
      headers: this.buildHeaders(),
      params: {
        Email: params.email,
        Tenant: params.tenantSubDomain
      },
    });
    return result.data;
  }

  public getSecurityProvider(): SecurityProvider {
    return this.securityProvider;
  }

  private buildPaging(paging: PagingParams, queryString: any) {
    if (paging) {
      // Limit
      if (paging.limit) {
        queryString.Limit = paging.limit;
      }
      // Skip
      if (paging.skip) {
        queryString.Skip = paging.skip;
      }
      // Record count
      if (paging.onlyRecordCount) {
        queryString.OnlyRecordCount = paging.onlyRecordCount;
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

  private buildHeaders(): object {
    return {
      'Content-Type': 'application/json',
    };
  }

  private buildSecuredHeaders(): object {
    return {
      'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json',
    };
  }

  private debugMethod(methodName: string) {
    if (this.debug) {
      // tslint:disable-next-line: no-console
      console.log(new Date().toISOString() + ' - ' + methodName);
    }
  }
}
