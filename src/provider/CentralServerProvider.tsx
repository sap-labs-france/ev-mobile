import {Buffer} from 'buffer';

/* eslint-disable @typescript-eslint/no-unsafe-return */
import {NavigationContainerRef, StackActions} from '@react-navigation/native';
import {AxiosInstance} from 'axios';
import I18n from 'i18n-js';
import jwtDecode from 'jwt-decode';
import {Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import Configuration from '../config/Configuration';
import I18nManager from '../I18n/I18nManager';
import Notifications from '../notification/Notifications';
import {PLATFORM} from '../theme/variables/commonColor';
import {ActionResponse, BillingOperationResult} from '../types/ActionResponse';
import {BillingInvoice, BillingPaymentMethod} from '../types/Billing';
import Car, {CarCatalog} from '../types/Car';
import ChargingStation from '../types/ChargingStation';
import {DataResult, TransactionDataResult} from '../types/DataResult';
import Eula, {EulaAccepted} from '../types/Eula';
import {KeyValue} from '../types/Global';
import QueryParams, {PagingParams} from '../types/QueryParams';
import {HttpChargingStationRequest} from '../types/requests/HTTPChargingStationRequests';
import {RESTServerRoute, ServerAction} from '../types/Server';
import {BillingSettings} from '../types/Setting';
import Site from '../types/Site';
import SiteArea from '../types/SiteArea';
import Tag from '../types/Tag';
import {TenantConnection} from '../types/Tenant';
import Transaction, {UserSessionContext} from '../types/Transaction';
import User, {UserDefaultTagCar, UserMobileData} from '../types/User';
import UserToken from '../types/UserToken';
import AxiosFactory from '../utils/AxiosFactory';
import Constants from '../utils/Constants';
import SecuredStorage from '../utils/SecuredStorage';
import Utils from '../utils/Utils';
import SecurityProvider from './SecurityProvider';
import {getApplicationName, getBundleId, getVersion} from 'react-native-device-info';

export default class CentralServerProvider {
  private axiosInstance: AxiosInstance;
  private debug = false;
  private captchaBaseUrl: string = Configuration.AWS_REST_ENDPOINT_PROD;
  private captchaSiteKey: string = Configuration.CAPTCHA_SITE_KEY;

  // Paste the token below
  private token: string = null;
  private decodedToken: UserToken = null;
  private email: string = null;
  private password: string = null;
  private locale: string = null;
  private tenant: TenantConnection = null;
  private currency: string = null;
  private siteImagesCache: Map<string, string> = new Map<string, string>();
  private tenantLogosCache: Map<string, string> = new Map<string, string>();
  private autoLoginDisabled = false;

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
    const userSettings = await SecuredStorage.getSettings();
    I18nManager.switchDistanceUnit(userSettings?.distanceUnit);
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

  public async getTenantLogoBySubdomain(tenant: TenantConnection = {} as TenantConnection): Promise<string> {
    this.debugMethod('getTenantLogoBySubdomain');
    let tenantLogo = null;
    // Call backend
    const result = await this.axiosInstance.get<any>(
      this.buildUtilRestEndpointUrl(RESTServerRoute.REST_TENANT_LOGO, null, tenant),
      {
        headers: this.buildHeaders(),
        responseType: 'arraybuffer',
        params: {
          Subdomain: tenant.subdomain
        }
      }
    );
    if (result.data) {
      const base64Image = Buffer.from(result.data).toString('base64');
      if (base64Image) {
        tenantLogo = 'data:' + result.headers['content-type'] + ';base64,' + base64Image;
        this.tenantLogosCache.set(`${tenant.subdomain}${tenant.endpoint?.endpoint}`, tenantLogo);
      }
    }
    return tenantLogo;
  }

  public async getCurrentTenantLogo(): Promise<string> {
    try {
      const currentTenantLogo = await this.getTenantLogoBySubdomain(this.tenant);
      return currentTenantLogo;
    } catch ( error ) {
      return null;
    }
  }

  public async triggerAutoLogin(navigation: NavigationContainerRef<any>, fctRefresh: () => void): Promise<void> {
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

  public async clearUserPassword(tenantSubdomain: string): Promise<void> {
    await SecuredStorage.clearUserPassword(tenantSubdomain);
    this.password = null;
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

  public getUserTenant(): TenantConnection {
    return this.tenant;
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
    this.setAutoLoginDisabled(true);
    this.debugMethod('logoff');
    // Clear the token and tenant
    if (this.tenant) {
      await SecuredStorage.clearUserToken(this.tenant.subdomain);
    }
    try {
      // Clear mobile data on logout
      await this.saveUserMobileData(this.getUserInfo().id, {} as UserMobileData);
      await this.axiosInstance.get(`${this.buildRestServerAuthURL(this.tenant)}/${RESTServerRoute.REST_SIGNOUT}`);
    } catch (e) {
      if (__DEV__) {
        console.error(e);
      }
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
    this.tenant = tenant;
    // Call
    const result = await this.axiosInstance.post<any>(
      `${this.buildRestServerAuthURL(tenant)}/${RESTServerRoute.REST_SIGNIN}`,
      {
        acceptEula,
        email,
        password,
        tenant: tenantSubDomain
      },
      { headers: this.buildHeaders() }
    );
    // Keep them
    this.email = email;
    this.password = password;
    this.token = result.data.token;
    this.decodedToken = jwtDecode(this.token);
    this.locale = this.decodedToken.locale;
    this.currency = this.decodedToken.currency;
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
      await this.saveUserMobileData(this.getUserInfo().id, {
        mobileToken: Notifications.getToken(),
        mobileOS: Platform.OS,
        mobileAppName: getApplicationName(),
        mobileVersion: getVersion(),
        mobileBundleID: getBundleId()
      });
    } catch (error) {
      console.log('Error saving Mobile Token:', error);
    }
  }

  public async getEndUserLicenseAgreement(params: { Language: string }): Promise<Eula> {
    this.debugMethod('getEndUserLicenseAgreement');
    // Call
    const result = await this.axiosInstance.get<any>(
      `${Configuration.AWS_REST_ENDPOINT_PROD}/v1/auth/${RESTServerRoute.REST_END_USER_LICENSE_AGREEMENT}`,
      {
        headers: this.buildHeaders(),
        params
      }
    );
    return result.data;
  }

  public async checkEndUserLicenseAgreement(params: { email: string; tenantSubDomain: string }): Promise<EulaAccepted> {
    this.debugMethod('checkEndUserLicenseAgreement');
    // Get the Tenant
    const tenant = await this.getTenant(params.tenantSubDomain);
    // Call
    const result = await this.axiosInstance.get<any>(
      `${this.buildRestServerAuthURL(tenant)}/${RESTServerRoute.REST_END_USER_LICENSE_AGREEMENT_CHECK}`,
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
    password: string,
    acceptEula: boolean,
    captcha: string
  ): Promise<any> {
    this.debugMethod('register');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post<any>(
      `${this.buildRestServerAuthURL(tenant)}/${RESTServerRoute.REST_SIGNON}`,
      {
        acceptEula,
        captcha,
        email,
        firstName,
        name,
        locale,
        password,
        tenant: tenantSubDomain
      },
      { headers: this.buildHeaders() }
    );
    // Clear the token and tenant
    await SecuredStorage.clearUserToken(tenantSubDomain);
    // Save
    await SecuredStorage.saveUserCredentials(tenantSubDomain, {
      email,
      password,
      tenantSubDomain
    });
    // Keep them
    this.email = email;
    this.password = password;
    this.token = null;
    this.decodedToken = null;
    this.tenant = tenant;
    return result.data;
  }

  public async retrievePassword(tenantSubDomain: string, email: string, captcha: string): Promise<any> {
    this.debugMethod('retrievePassword');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post<any>(
      `${this.buildRestServerAuthURL(tenant)}/${RESTServerRoute.REST_PASSWORD_RESET}`,
      {
        tenant: tenantSubDomain,
        captcha,
        email
      },
      { headers: this.buildHeaders() }
    );
    return result.data;
  }

  public async resetPassword(tenantSubDomain: string, hash: string, password: string): Promise<any> {
    this.debugMethod('resetPassword');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.post<any>(
      `${this.buildRestServerAuthURL(tenant)}/${RESTServerRoute.REST_PASSWORD_RESET}`,
      {
        tenant: tenantSubDomain,
        hash,
        password
      },
      { headers: this.buildHeaders() }
    );
    return result.data;
  }

  public async verifyEmail(tenantSubDomain: string, email: string, token: string): Promise<ActionResponse> {
    this.debugMethod('verifyEmail');
    // Get the Tenant
    const tenant = await this.getTenant(tenantSubDomain);
    // Call
    const result = await this.axiosInstance.get<any>(
      `${this.buildRestServerAuthURL(tenant)}/${RESTServerRoute.REST_MAIL_CHECK}`,
      {
        headers: this.buildHeaders(),
        params: {
          Tenant: tenantSubDomain,
          Email: email,
          VerificationToken: token
        }
      }
    );
    return result.data;
  }

  public async getChargingStations(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<ChargingStation>> {
    this.debugMethod('getChargingStations');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      `${this.buildRestServerURL()}/${RESTServerRoute.REST_CHARGING_STATIONS}`,
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result?.data;
  }

  public async saveUserMobileData(userID: string, params: UserMobileData): Promise<ActionResponse> {
    this.debugMethod('saveUserMobileData');
    // Call
    const result = await this.axiosInstance.put<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_USER_UPDATE_MOBILE_DATA, { id: userID }),
      params,
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getChargingStation(id: string, extraParams: HttpChargingStationRequest = {}): Promise<ChargingStation> {
    this.debugMethod('getChargingStation');
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CHARGING_STATION, { id }),
      {
        headers: this.buildSecuredHeaders(),
        params: {
          ID: id,
          ...extraParams
        }
      }
    );
    return result.data;
  }

  public async getChargingStationOcppParameters(id: string): Promise<DataResult<KeyValue>> {
    this.debugMethod('getChargingStationOcppParameters');
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CHARGING_STATION_GET_OCPP_PARAMETERS, { id }),
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getSites(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<Site>> {
    this.debugMethod('getSites');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_SITES),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getSiteAreas(
    params = {},
    paging: PagingParams = Constants.DEFAULT_PAGING,
    sorting: string[] = []
  ): Promise<DataResult<SiteArea>> {
    this.debugMethod('getSiteAreas');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_SITE_AREAS),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  // eslint-disable-next-line max-len
  public async startTransaction(chargingStationID: string, connectorId: number, visualTagID: string, carID: string, userID: string, carStateOfCharge: number, targetStateOfCharge: number, departureTime: string): Promise<ActionResponse> {
    this.debugMethod('startTransaction');
    // Call
    const result = await this.axiosInstance.put<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTION_START),
      {
        chargingStationID,
        carID,
        userID,
        carStateOfCharge,
        targetStateOfCharge,
        departureTime,
        args: {
          visualTagID,
          connectorId
        },
      },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async stopTransaction(transactionId: number): Promise<ActionResponse> {
    this.debugMethod('stopTransaction');
    // Call
    const result = await this.axiosInstance.put<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTION_STOP, { id: transactionId }),
      { },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async softStopTransaction(transactionID: number): Promise<ActionResponse> {
    this.debugMethod('softStopTransaction');
    const result = await this.axiosInstance.put<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTION_SOFT_STOP, { id: transactionID }),
      {},
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async reset(chargingStationID: string, type: 'Soft' | 'Hard'): Promise<ActionResponse> {
    this.debugMethod('reset');
    const url = this.buildRestEndpointUrl(RESTServerRoute.REST_CHARGING_STATIONS_RESET, { id: chargingStationID });
    // Call
    const result = await this.axiosInstance.put<any>(
      url,
      {
        args: {
          type
        }
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
    const result = await this.axiosInstance.put<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CHARGING_STATIONS_CACHE_CLEAR, { id: chargingStationID }),
      null,
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async unlockConnector(chargingStationID: string, connectorId: number): Promise<ActionResponse> {
    this.debugMethod('unlockConnector');
    // Call
    const result = await this.axiosInstance.put<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CHARGING_STATIONS_UNLOCK_CONNECTOR, { id: chargingStationID, connectorId }),
      null,
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getTransaction(id: number): Promise<Transaction> {
    this.debugMethod('getTransaction');
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTION, { id }),
      {
        headers: this.buildSecuredHeaders(),
        params: {
          WithUser: true
        }
      }
    );
    return result.data;
  }

  public async getLastTransaction(chargingStationID: string, connectorID: number): Promise<Transaction> {
    this.debugMethod('getLastTransaction');
    const params: { [param: string]: string } = {};
    params.ConnectorID = connectorID.toString();
    params.Limit = '1';
    params.Skip = '0';
    params.Status = 'completed';
    params.SortFields = '-timestamp';
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CHARGING_STATIONS_TRANSACTIONS, { id: chargingStationID }),
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

  public async getTransactions(
    params = {},
    paging: PagingParams = Constants.DEFAULT_PAGING,
    sorting: string[] = []
  ): Promise<TransactionDataResult> {
    this.debugMethod('getTransactions');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTIONS_COMPLETED),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async createCar(car: Car, forced: boolean): Promise<ActionResponse> {
    this.debugMethod('createCar');
    // Execute
    const response = await this.axiosInstance.post<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CARS),
      { ...car, forced },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return response?.data;
  }

  public async getCars(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<Car>> {
    this.debugMethod('getCars');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_CARS),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getCarCatalog(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<CarCatalog>> {
    this.debugMethod('getCarCatalog');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CAR_CATALOGS}`,
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getCar(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<Car> {
    this.debugMethod('getCar');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      `${this.buildCentralRestServerServiceSecuredURL()}/${ServerAction.CAR}`,
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getUsers(params = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<User>> {
    this.debugMethod('getUsers');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_USERS),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getUserDefaultTagCar(userID: string, chargingStationID: string): Promise<UserDefaultTagCar> {
    this.debugMethod('getUserDefaultTagCar');
    const res = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_USER_DEFAULT_TAG_CAR, { id: userID }),
      {
        headers: this.buildSecuredHeaders(),
        params: {
          UserID: userID, // Should be removed - already part of the URL path
          ChargingStationID: chargingStationID // This information will soon be mandatory server-side
        }
      }
    );
    return res?.data as UserDefaultTagCar;
  }

  public async getTags(params: any = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<Tag>> {
    this.debugMethod('getTags');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Force only local tags
    params.Issuer = true;
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TAGS),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data as DataResult<Tag>;
  }

  public async getInvoices(
    params = {},
    paging: PagingParams = Constants.DEFAULT_PAGING,
    sorting: string[] = []
  ): Promise<DataResult<BillingInvoice>> {
    this.debugMethod('getInvoices');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    // Call
    const result = await this.axiosInstance.get<any>(
      `${this.buildRestServerURL()}/${RESTServerRoute.REST_BILLING_INVOICES}`,
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data as DataResult<BillingInvoice>;
  }

  public async requestChargingStationOcppParameters(id: string): Promise<ActionResponse> {
    this.debugMethod('requestChargingStationOCPPConfiguration');
    // Call
    const result = await this.axiosInstance.post<any>(
      `${this.buildRestServerURL()}/${RESTServerRoute.REST_CHARGING_STATIONS_REQUEST_OCPP_PARAMETERS}`,
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

  public async getTransactionsActive(params: any = {}, paging: PagingParams = Constants.DEFAULT_PAGING, sorting: string[] = []): Promise<DataResult<Transaction>> {
    this.debugMethod('getTransactionsActive');
    // Build Paging
    this.buildPaging(paging, params);
    // Build Sorting
    this.buildSorting(sorting, params);
    params.WithUser = 'true';
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTIONS_ACTIVE),
      {
        headers: this.buildSecuredHeaders(),
        params
      }
    );
    return result.data;
  }

  public async getUserImage(id: string): Promise<string> {
    this.debugMethod('getUserImage');
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_USER_IMAGE, { id }),
      {
        headers: this.buildSecuredHeaders(),
        params: { ID: id }
      }
    );
    return result.data.image as string;
  }

  public async getUser(id: string): Promise<User> {
    this.debugMethod('getUser');
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_USER, { id }),
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async getSiteImage(id: string): Promise<string> {
    this.debugMethod('getSiteImage');
    // Check cache
    let foundSiteImage = this.siteImagesCache.get(id);
    if (!foundSiteImage) {
      // Call backend
      const result = await this.axiosInstance.get<any>(
        this.buildUtilRestEndpointUrl(RESTServerRoute.REST_SITE_IMAGE, { id }),
        {
          headers: this.buildHeaders(),
          responseType: 'arraybuffer',
          params: {
            TenantID: this.decodedToken?.tenantID
          }
        }
      );
      if (result.data) {
        const base64Image = Buffer.from(result.data).toString('base64');
        if (base64Image) {
          foundSiteImage = 'data:' + result.headers['content-type'] + ';base64,' + base64Image;
          this.siteImagesCache.set(id, foundSiteImage);
        }
      }
    }
    return foundSiteImage;
  }

  public async getTransactionConsumption(transactionId: number): Promise<Transaction> {
    this.debugMethod('getTransactionConsumption');
    // Call
    const result = await this.axiosInstance.get<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_TRANSACTION_CONSUMPTIONS,
      { id: transactionId }),
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data;
  }

  public async sendErrorReport(mobile: string, subject: string, description: string): Promise<any> {
    this.debugMethod('sendErrorReport');
    const result = await this.axiosInstance.post<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_NOTIFICATIONS_END_USER_REPORT_ERROR),
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

  public async setUpPaymentMethod(params: { userID: string }): Promise<BillingOperationResult> {
    this.debugMethod('setUpPaymentMethod');
    const result = await this.axiosInstance.post<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_BILLING_PAYMENT_METHOD_SETUP, { userID: params.userID }),
      { userID: params.userID },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data as BillingOperationResult;
  }

  public async attachPaymentMethod(params: { userID: string; paymentMethodId: string }): Promise<BillingOperationResult> {
    this.debugMethod('attachPaymentMethod');
    const result = await this.axiosInstance.post<any>(
      this.buildRestEndpointUrl(RESTServerRoute.REST_BILLING_PAYMENT_METHOD_ATTACH, { userID: params.userID, paymentMethodID: params.paymentMethodId }),
      { params },
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return result.data as BillingOperationResult;
  }

  public async deletePaymentMethod(userID: string, paymentMethodID: string): Promise<BillingOperationResult> {
    this.debugMethod('deletePaymentMethod');
    const res = await this.axiosInstance.delete(
      this.buildRestEndpointUrl(RESTServerRoute.REST_BILLING_PAYMENT_METHOD, { userID, paymentMethodID }),
      {
        headers: this.buildSecuredHeaders()
      }
    );
    return res?.data as BillingOperationResult;
  }

  public async getPaymentMethods(params: { currentUserID: string }, paging: PagingParams = Constants.DEFAULT_PAGING): Promise<DataResult<BillingPaymentMethod>> {
    this.debugMethod('getPaymentMethods');
    // Build Paging
    this.buildPaging(paging, params);
    // Call
    try {
      const result = await this.axiosInstance.get<any>(
        this.buildRestEndpointUrl(RESTServerRoute.REST_BILLING_PAYMENT_METHODS, { userID: params.currentUserID }),
        {
          headers: this.buildSecuredHeaders(),
          params
        }
      );
      return result?.data as DataResult<BillingPaymentMethod>;
    } catch (e) {
      return null;
    }
  }

  public async getBillingSettings(): Promise<BillingSettings> {
    this.debugMethod('getBillingSettings');
    // Execute the REST Service
    try {
      const result = await this.axiosInstance.get<BillingSettings>(
        `${this.buildRestServerURL()}/${RESTServerRoute.REST_BILLING_SETTING}`,
        {
          headers: this.buildSecuredHeaders()
        }
      );
      return result.data;
    } catch (error) {
      return null;
    }
  }

  /* eslint-disable @typescript-eslint/indent */
  public async downloadInvoice(invoice: BillingInvoice): Promise<void> {
    this.debugMethod('downloadInvoice');
    const fileName = `${I18n.t('invoices.invoice')}_${invoice.number}.pdf`;
    let config;
    if (Platform.OS === PLATFORM.IOS) {
      config = { fileCache: true, path: ReactNativeBlobUtil.fs.dirs.DocumentDir + '/' + fileName, appendExt: 'pdf' };
    } else if (Platform.OS === PLATFORM.ANDROID) {
      config = {
        fileCache: true,
        addAndroidDownloads: {
          path: ReactNativeBlobUtil.fs.dirs.DownloadDir + '/' + fileName,
          useDownloadManager: true,
          mime: 'application/pdf',
          notification: true,
          title: fileName,
          mediaScannable: true,
          description: `${I18n.t('invoices.invoiceFileDescription')} ${invoice.number}`
        }
      };
    }
    if (config) {
      await ReactNativeBlobUtil.config(config)
        .fetch(
          'GET',
          this.buildRestEndpointUrl(RESTServerRoute.REST_BILLING_DOWNLOAD_INVOICE, { invoiceID: invoice.id }),
          this.buildSecuredHeaders()
        ).then(async (res) => {
          // Open the  downloaded invoice
          // On IOS, apps can only save files in their own internal filesystem
          // We need to open it to be able to save it to the phone custom directories
          if (Platform.OS === PLATFORM.IOS) {
            ReactNativeBlobUtil.ios.openDocument(res.path());
          } else {
            await ReactNativeBlobUtil.android.actionViewIntent(res.path(), 'application/pdf');
          }
        });
    }
  }

  public async getUserSessionContext(userID: string, chargingStationID: string, connectorID: number, carID: string, tagID: string): Promise<UserSessionContext> {
    this.debugMethod('getUserSessionContext');
    const result = await this.axiosInstance.get(this.buildRestEndpointUrl(RESTServerRoute.REST_USER_SESSION_CONTEXT, {userID}),
      {
        headers: this.buildSecuredHeaders(),
        params: {
          ChargingStationID: chargingStationID,
          ConnectorID: connectorID,
          CarID: carID,
          TagID: tagID
        }
      });
    return result.data;
  }

  public getSecurityProvider(): SecurityProvider {
    return this.securityProvider;
  }

  private buildPaging(paging: PagingParams, queryParams: QueryParams): void {
    if (paging) {
      // Limit
      if (paging.limit) {
        queryParams.Limit = paging.limit;
      }
      // Skip
      if (paging.skip) {
        queryParams.Skip = paging.skip;
      }
      // Record count
      if (paging.onlyRecordCount) {
        queryParams.OnlyRecordCount = paging.onlyRecordCount;
      }
    }
  }

  private buildSorting(sortingParams: string[], queryParams: QueryParams): void {
    const sortFields = sortingParams.join(',');
    if (sortFields) {
      queryParams.SortFields = sortFields;
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
    return (tenant?.endpoint?.endpoint) + '/v1/auth';
  }

  private buildRestServerURL(): string {
    return this.tenant?.endpoint?.endpoint + '/v1/api';
  }

  private buildUtilRestServerURL(tenant?: TenantConnection): string {
    return (tenant?.endpoint?.endpoint ?? this.tenant?.endpoint?.endpoint) + '/v1/util';
  }

  private buildCentralRestServerServiceSecuredURL(): string {
    return this.tenant?.endpoint.endpoint + '/client/api';
  }

  public buildRestEndpointUrl(urlPatternAsString: RESTServerRoute, params: { [name: string]: string | number | null } = {}, urlPrefix = this.buildRestServerURL()): string {
    let resolvedUrlPattern = urlPatternAsString as string;
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        resolvedUrlPattern = resolvedUrlPattern.replace(`:${key}`, encodeURIComponent(params[key]));
      }
    }
    return `${urlPrefix}/${resolvedUrlPattern}`;
  }

  public buildUtilRestEndpointUrl(urlPatternAsString: RESTServerRoute, params: { [name: string]: string | number | null } = {}, tenant?: TenantConnection): string {
    return this.buildRestEndpointUrl(urlPatternAsString, params, this.buildUtilRestServerURL(tenant));
  }
}
