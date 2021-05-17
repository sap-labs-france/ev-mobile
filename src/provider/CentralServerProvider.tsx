import { Buffer } from 'buffer';

import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { AxiosInstance } from 'axios';
import jwtDecode from 'jwt-decode';

import Configuration from '../config/Configuration';
import I18nManager from '../I18n/I18nManager';
import NotificationManager from '../notification/NotificationManager';
import { ActionResponse, BillingOperationResponse } from '../types/ActionResponse';
import { BillingPaymentMethod } from '../types/Billing';
import Car from '../types/Car';
import ChargingStation from '../types/ChargingStation';
import { DataResult, TransactionDataResult } from '../types/DataResult';
import Eula, { EulaAccepted } from '../types/Eula';
import { KeyValue } from '../types/Global';
import PagingParams from '../types/PagingParams';
import { ServerAction, ServerRoute } from '../types/Server';
import { BillingSettings } from '../types/Setting';
import Site from '../types/Site';
import SiteArea from '../types/SiteArea';
import Tag from '../types/Tag';
import { TenantConnection } from '../types/Tenant';
import Transaction from '../types/Transaction';
import User from '../types/User';
import UserToken from '../types/UserToken';
import AxiosFactory from '../utils/AxiosFactory';
import Constants from '../utils/Constants';
import SecuredStorage from '../utils/SecuredStorage';
import Utils from '../utils/Utils';
import SecurityProvider from './SecurityProvider';

export default class CentralServerProvider {
  private axiosInstance: AxiosInstance;
  private debug = false;
  private captchaBaseUrl: string = Configuration.SCP_CAPTCHA_BASE_URL;
  private captchaSiteKey: string = Configuration.SCP_CAPTCHA_SITE_KEY;

  // Paste the token below
  private token: string = null;
  private decodedToken: UserToken = null;
  private email: string = null;
  private password: string = null;
  private locale: string = null;
  private tenant: TenantConnection = null;
  private currency: string = null;
  private siteImages: Map<string, string> = new Map<string, string>();
  private tenantLogo: string;
  private autoLoginDisabled = false;
  private notificationManager: NotificationManager;

  private securityProvider: SecurityProvider = null;

  public constructor() {
    // Get axios instance
    this.axiosInstance = AxiosFactory.getAxiosInstance();
    if (__DEV__) {
      this.debug = true;
      // Debug Axios
      this.axiosInstance.interceptors.request.use((request) => {
        console.log(new Date().toISOString() + ' - Axios - Request:', request);
        return request;
      });
      this.axiosInstance.interceptors.response.use((response) => {
        console.log(new Date().toISOString() + ' - Axios - Response:', response);
        return response;
      });
    }
  }

  public setNotificationManager(notificationManager: NotificationManager): void {
    this.notificationManager = notificationManager;
  }

  public async initialize(): Promise<void> {
    // Get stored data
    const credentials = await SecuredStorage.getUserCredentials(this.tenant?.subdomain);
    if (credentials) {
      // Set
      const tenant = await this.getTenant(credentials.tenantSubDomain);
      this.tenant = tenant;
      this.email = credentials.email;
      this.password = credentials.password;
      this.token = credentials.token;
      this.locale = credentials.locale;
      this.currency = credentials.currency;
    } else {
      // Set
      this.email = null;
      this.password = null;
      this.token = null;
      this.tenant = null;
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
    // Adjust the language according the device default
    I18nManager.switchLanguage(this.getUserLanguage(), this.currency);
  }

  public getCaptchaBaseUrl(): string {
    return this.captchaBaseUrl;
  }

  public getCaptchaSiteKey(): string {
    return this.captchaSiteKey;
  }

  public async getTenant(tenantSubDomain: string): Promise<TenantConnection> {
    const tenants = await this.getTenants();
    if (tenants) {
      return tenants.find((tenant: TenantConnection) => tenant.subdomain === tenantSubDomain);
    }
    return null;
  }

  public async getTenants(): Promise<TenantConnection[]> {
    // Get the tenants from the storage first
    const tenants = await SecuredStorage.getTenants();
    if (!tenants) {
      return [];
    }
    return tenants.sort((tenant1: TenantConnection, tenant2: TenantConnection) => {
      if (tenant1.name < tenant2.name) {
        return -1;
      }
      if (tenant1.name > tenant2.name) {
        return 1;
      }
      return 0;
    });
  }

  public async getTenantLogoBySubdomain(tenant: TenantConnection): Promise<string> {
    this.debugMethod('getTenantLogoBySubdomain');
    let tenantLogo: string;
    // Call backend
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceUtilURL(tenant)}/${ServerAction.TENANT_LOGO}`, {
      headers: this.buildHeaders(),
      responseType: 'arraybuffer',
      params: {
        Subdomain: tenant.subdomain
      }
    });
    if (result.data) {
      const base64Image = Buffer.from(result.data).toString('base64');
      if (base64Image) {
        tenantLogo = 'data:' + result.headers['content-type'] + ';base64,' + base64Image;
      }
    }
    this.tenantLogo = tenantLogo;
    return tenantLogo;
  }

  public getCurrentTenantLogo(): string {
    return this.tenantLogo;
  }

  public async triggerAutoLogin(navigation: NavigationContainerRef, fctRefresh: () => void): Promise<void> {
    this.debugMethod('triggerAutoLogin');
    try {
      // Force log the user
      await this.login(this.email, this.password, true, this.tenant.subdomain);
      // Ok: Refresh
      if (fctRefresh) {
        fctRefresh();
      }
    } catch (error) {
      // Ko: Logoff
      this.setAutoLoginDisabled(true);
      await this.logoff();
      // Go to login page
      if (navigation) {
        navigation.dispatch(
          StackActions.replace('AuthNavigator', {
            name: 'Login',
            key: `${Utils.randomNumber()}`
          })
        );
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

  public async clearUserPassword(): Promise<void> {
    await SecuredStorage.clearUserPassword(this.tenant.subdomain);
    this.password = null;
  }

  public getUserEmail(): string {
    return this.email;
  }

  public getUserCurrency(): string {
    return this.currency;
  }

  public getUserLocale(): string {
    if (Configuration.isServerLocalePreferred && this.locale && Constants.SUPPORTED_LOCALES.includes(this.locale)) {
      return this.locale;
    }
    return Utils.getDeviceDefaultSupportedLocale();
  }

  public getUserLanguage(): string {
    if (
      Configuration.isServerLocalePreferred &&
      this.locale &&
      Constants.SUPPORTED_LANGUAGES.includes(Utils.getLanguageFromLocale(this.locale))
    ) {
      return Utils.getLanguageFromLocale(this.locale);
    }
    return Utils.getDeviceDefaultSupportedLanguage();
  }

  public getUserPassword(): string {
    return this.password;
  }

  public getUserTenant(): TenantConnection {
    return this.tenant;
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

  public setAutoLoginDisabled(autoLoginDisabled: boolean): void {
    this.autoLoginDisabled = autoLoginDisabled;
  }

  public async logoff(): Promise<void> {
    this.debugMethod('logoff');
    // Clear the token and tenant
    if (this.tenant) {
      await SecuredStorage.clearUserToken(this.tenant.subdomain);
    }
    // Clear local data
    this.token = null;
    this.decodedToken = null;
    this.tenant = null;
    this.email = null;
    this.password = null;
  }

  public async login(email: string, password: string, acceptEula: boolean, tenantSubDomain: string): Promise<void> {
    this.debugMethod('login');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_SIGNIN}`,
      {
        acceptEula,
        email,
        password,
        tenant: tenantSubDomain
      },
      {
        headers: this.buildHeaders()
      }
    );
    // Keep them
    this.email = email;
    this.password = password;
    this.token = result.data.token;
    this.decodedToken = jwtDecode(this.token);
    this.locale = this.decodedToken.locale;
    this.currency = this.decodedToken.currency;
    this.tenant = tenant;
    this.securityProvider = new SecurityProvider(this.decodedToken);
    // Save
    await SecuredStorage.saveUserCredentials(tenantSubDomain, {
      email,
      password,
      tenantSubDomain,
      token: result.data.token,
      locale: this.decodedToken.locale,
      currency: this.decodedToken.currency
    });
    // Adjust the language according the device default
    I18nManager.switchLanguage(this.getUserLanguage(), this.currency);
    try {
      // Save the User's token
      await this.saveUserMobileToken({
        id: this.getUserInfo().id,
        mobileToken: this.notificationManager.getToken(),
        mobileOS: this.notificationManager.getOs()
      });
    } catch (error) {
      console.log('Error saving Mobile Token:', error);
    }
    // Check on hold notification
    this.notificationManager.checkOnHoldNotification();
  }

  public async getEndUserLicenseAgreement(tenantSubDomain: string, params: { Language: string }): Promise<Eula> {
    this.debugMethod('getEndUserLicenseAgreement');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.get(`${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_END_USER_LICENSE_AGREEMENT}`, {
      headers: this.buildHeaders(),
      params
    });
    return result.data;
  }

  public async checkEndUserLicenseAgreement(params: { email: string; tenantSubDomain: string }): Promise<EulaAccepted> {
    this.debugMethod('checkEndUserLicenseAgreement');
    // Get the Tenant
    const tenant = await this.getTenant(params.tenantSubDomain);
    // Call
    const result = await this.axiosInstance.get(
      `${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_END_USER_LICENSE_AGREEMENT_CHECK}`,
      {
        headers: this.buildHeaders(),
        params: {
          Email: params.email,
          Tenant: params.tenantSubDomain
        }
      }
    );
    return result.data;
  }

  public async register(
    tenantSubDomain: string,
    name: string,
    firstName: string,
    email: string,
    locale: string,
    passwords: { password: string; repeatPassword: string },
    acceptEula: boolean,
    captcha: string
  ) {
    this.debugMethod('register');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_SIGNON}`,
      {
        acceptEula,
        captcha,
        email,
        firstName,
        name,
        locale,
        passwords,
        tenant: tenantSubDomain
      },
      {
        headers: this.buildHeaders()
      }
    );
    // Clear the token and tenant
    SecuredStorage.clearUserToken(tenantSubDomain);
    // Save
    await SecuredStorage.saveUserCredentials(tenantSubDomain, {
      email,
      password: passwords.password,
      tenantSubDomain
    });
    // Keep them
    this.email = email;
    this.password = passwords.password;
    this.token = null;
    this.decodedToken = null;
    this.tenant = tenant;
    return result.data;
  }

  public async retrievePassword(tenantSubDomain: string, email: string, captcha: string) {
    this.debugMethod('retrievePassword');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_PASSWORD_RESET}`,
      {
        tenant: tenantSubDomain,
        captcha,
        email
      },
      {
        headers: this.buildHeaders()
      }
    );
    return result.data;
  }

  public async resetPassword(tenantSubDomain: string, hash: string, passwords: { password: string; repeatPassword: string }) {
    this.debugMethod('resetPassword');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_PASSWORD_RESET}`,
      {
        tenant: tenantSubDomain,
        hash,
        passwords
      },
      {
        headers: this.buildHeaders()
      }
    );
    return result.data;
  }

  public async verifyEmail(tenantSubDomain: string, email: string, token: string): Promise<ActionResponse> {
    this.debugMethod('verifyEmail');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.get(`${this.buildRestServerAuthURL(tenant)}/${ServerRoute.REST_MAIL_CHECK}`, {
      headers: this.buildHeaders(),
      params: {
        Tenant: tenantSubDomain,
        Email: email,
        VerificationToken: token
      }
    });
    return result.data;
  }

  public async getChargingStations(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<ChargingStation>> {
    this.debugMethod('getChargingStations');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATIONS}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async saveUserMobileToken(params: { id: string; mobileToken: string; mobileOS: string }): Promise<ActionResponse> {
    this.debugMethod('saveUserMobileToken');
    // Call
    const result = await this.axiosInstance.put(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.USER_UPDATE_MOBILE_TOKEN}`,
      params,
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getChargingStation(id: string): Promise<ChargingStation> {
    this.debugMethod('getChargingStation');
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION}`, {
      headers: this.buildSecuredHeaders(),
      params: {
        ID: id
      }
    });
    return result.data;
  }

  public async getChargingStationOcppParameters(id: string): Promise<DataResult<KeyValue>> {
    this.debugMethod('getChargingStationOcppParameters');
    // Call
    const result = await this.axiosInstance.get(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATIONS_OCPP_PARAMETERS}?ChargingStationID=${id}`,
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getSites(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<Site>> {
    this.debugMethod('getSites');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.SITES}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async getSiteAreas(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<SiteArea>> {
    this.debugMethod('getSiteAreas');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.SITE_AREAS}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async startTransaction(chargingStationID: string, connectorId: number, tagID: string): Promise<ActionResponse> {
    this.debugMethod('startTransaction');
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_REMOTE_START_TRANSACTION}`,
      {
        args: {
          connectorId,
          tagID
        },
        chargingStationID
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async stopTransaction(chargingStationID: string, transactionId: number): Promise<ActionResponse> {
    this.debugMethod('stopTransaction');
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_REMOTE_STOP_TRANSACTION}`,
      {
        args: {
          transactionId
        },
        chargingStationID
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async reset(chargingStationID: string, type: 'Soft' | 'Hard'): Promise<ActionResponse> {
    this.debugMethod('reset');
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_RESET}`,
      {
        args: {
          type
        },
        chargingStationID
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async clearCache(chargingStationID: string): Promise<ActionResponse> {
    this.debugMethod('clearCache');
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_CLEAR_CACHE}`,
      {
        args: {},
        chargingStationID
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async unlockConnector(chargingStationID: string, connectorId: number): Promise<ActionResponse> {
    this.debugMethod('unlockConnector');
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_UNLOCK_CONNECTOR}`,
      {
        args: {
          connectorId
        },
        chargingStationID
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getTransaction(id: number): Promise<Transaction> {
    this.debugMethod('getTransaction');
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.TRANSACTION}`, {
      headers: this.buildSecuredHeaders(),
      params: {
        ID: id
      }
    });
    return result.data;
  }

  public async getLastTransaction(chargingStationID: string, connectorId: number): Promise<Transaction> {
    this.debugMethod('getLastTransaction');
    const params: { [param: string]: string } = {};
    params.ChargingStationID = chargingStationID;
    params.ConnectorId = connectorId.toString();
    params.Limit = '1';
    params.Skip = '0';
    params.SortFields = '-timestamp';
    // Call
    const result = await this.axiosInstance.get(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_TRANSACTIONS}`,
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    if (result.data?.result?.length > 0) {
      return result.data.result[0];
    }
    return null;
  }

  public async getTransactions(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<TransactionDataResult> {
    this.debugMethod('getTransactions');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.TRANSACTIONS_COMPLETED}`,
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getCars(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<Car>> {
    this.debugMethod('getCars');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CARS}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async getUsers(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<User>> {
    this.debugMethod('getUsers');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.USERS}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async getTags(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<Tag>> {
    this.debugMethod('getTags');
    // Build Paging
    this.buildPaging(paging, params);
    // Force only local tags
    params.Issuer = true;
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.TAGS}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async requestChargingStationOcppParameters(id: string): Promise<ActionResponse> {
    this.debugMethod('requestChargingStationOCPPConfiguration');
    // Call
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CHARGING_STATION_REQUEST_OCPP_PARAMETERS}`,
      {
        chargingStationID: id,
        forceUpdateOCPPParamsFromTemplate: false
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getTransactionsActive(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<Transaction>> {
    this.debugMethod('getTransactionsActive');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.TRANSACTIONS_ACTIVE}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data;
  }

  public async getUserImage(params = {}): Promise<string> {
    this.debugMethod('getUserImage');
    // Call
    const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.USER_IMAGE}`, {
      headers: this.buildSecuredHeaders(),
      params
    });
    return result.data.image;
  }

  public async getSiteImage(id: string): Promise<string> {
    this.debugMethod('getSiteImage');
    // Check cache
    let foundSiteImage = this.siteImages.get(id);
    if (!foundSiteImage) {
      // Call backend
      const result = await this.axiosInstance.get(`${this.buildCentralRestServerServiceUtilURL(this.tenant)}/${ServerAction.SITE_IMAGE}`, {
        headers: this.buildHeaders(),
        responseType: 'arraybuffer',
        params: {
          ID: id,
          TenantID: this.decodedToken?.tenantID
        }
      });
      if (result.data) {
        const base64Image = Buffer.from(result.data).toString('base64');
        if (base64Image) {
          foundSiteImage = 'data:' + result.headers['content-type'] + ';base64,' + base64Image;
          this.siteImages.set(id, foundSiteImage);
        }
      }
    }
    return foundSiteImage;
  }

  public async getTransactionConsumption(transactionId: number): Promise<Transaction> {
    this.debugMethod('getChargingStationConsumption');
    // Call
    const result = await this.axiosInstance.get(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.TRANSACTION_CONSUMPTION}`,
      {
        headers: this.buildSecuredHeaders(),
        params: { TransactionId: transactionId }
      }
    );
    return result.data;
  }

  public async sendErrorReport(mobile: string, subject: string, description: string) {
    this.debugMethod('sendErrorReport');
    const result = await this.axiosInstance.post(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.END_USER_REPORT_ERROR}`,
      {
        mobile,
        subject,
        description
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async setUpPaymentMethod(params: { userID: string }): Promise<BillingOperationResponse> {
    const url = `${this.buildRestServerURL()}/${ServerRoute.REST_BILLING_PAYMENT_METHOD_SETUP}`.replace(':userID', params.userID);
    const result = await this.axiosInstance.post(url, { userID: params.userID }, { headers: this.buildSecuredHeaders() });
    return result.data as BillingOperationResponse;
  }

  public async attachPaymentMethod(params: { userID: string; paymentMethodId: string }): Promise<BillingOperationResponse> {
    const url = `${this.buildRestServerURL()}/${ServerRoute.REST_BILLING_PAYMENT_METHOD_ATTACH}`
      .replace(':userID', params.userID)
      .replace(':paymentMethodID', params.paymentMethodId);
    const result = await this.axiosInstance.post(url, { params }, { headers: this.buildSecuredHeaders() });
    return result.data as BillingOperationResponse;
  }

  public async getPaymentMethods(
    params: { currentUserID: string },
    paging: PagingParams = Constants.DEFAULT_PAGING
  ): Promise<DataResult<BillingPaymentMethod>> {
    this.debugMethod('getPaymentMethods');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    const url = `${this.buildRestServerURL()}/${ServerRoute.REST_BILLING_PAYMENT_METHODS}`.replace(':userID', params.currentUserID);
    const result = await this.axiosInstance.get(url, {
      headers: this.buildSecuredHeaders()
    });
    return result.data as DataResult<BillingPaymentMethod>;
  }

  public async getBillingSettings(): Promise<BillingSettings> {
    // Build the URL
    const url = `${this.buildRestServerURL()}/${ServerRoute.REST_BILLING_SETTING}`;
    // Execute the REST Service
    const result = await this.axiosInstance.get<BillingSettings>(url, {
      headers: this.buildSecuredHeaders()
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

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json'
    };
  }

  private buildSecuredHeaders(): Record<string, string> {
    return {
      Authorization: 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    };
  }

  private debugMethod(methodName: string) {
    if (this.debug) {
      console.log(new Date().toISOString() + ' - ' + methodName);
    }
  }

  private buildRestServerAuthURL(tenant: TenantConnection): string {
    return tenant?.endpoint + '/v1/auth';
  }

  private buildRestServerURL(): string {
    return this.tenant?.endpoint + '/v1/api';
  }

  private buildCentralRestServerServiceUtilURL(tenant: TenantConnection): string {
    return tenant?.endpoint + '/client/util';
  }

  private buildCentralRestServerServiceSecuredURL(): string {
    return this.tenant?.endpoint + '/client/api';
  }
}
