import { NavigationState } from 'react-navigation';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

import ProviderFactory from '../provider/ProviderFactory';
import { SecuredStorageKey } from '../types/SecuredStorageKeys';
import Tenant from '../types/Tenant';
import { UserCredentials } from '../types/User';

// Generate a new Id for persisting the navigation each time the app is launched first time
let navigationID: string = '' + new Date().getTime();
if (__DEV__) {
  // Keep the same key for dev
  navigationID = '1234567';
}

export default class SecuredStorage {
  public static async getNavigationState(): Promise<NavigationState> {
    const navigationState = await SecuredStorage._getJson(SecuredStorageKey.NAVIGATION_STATE);
    // Check the key
    if (navigationState) {
      if (navigationState.key === navigationID) {
        return navigationState.navigationState;
      }
    }
    return null;
  }

  public static async saveNavigationState(navigationState: NavigationState) {
    // Add a key
    await RNSecureStorage.set(
      SecuredStorageKey.NAVIGATION_STATE,
      JSON.stringify({ key: navigationID, navigationState }),
      { accessible: ACCESSIBLE.WHEN_UNLOCKED }
    );
  }

  public static async getUserCredentials(tenantSubDomain: string): Promise<UserCredentials> {
    // Get current domain
    if (!tenantSubDomain) {
      tenantSubDomain = await SecuredStorage.getCurrentTenantSubDomain();
    }
    // Get User Credentials
    return SecuredStorage._getJson(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
  }

  public static async clearUserToken(tenantSubDomain: string) {
    const credentials = await SecuredStorage._getJson(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
    if (credentials) {
      Reflect.deleteProperty(credentials, 'token');
      await SecuredStorage.saveUserCredentials(tenantSubDomain, credentials);
    }
  }

  public static async clearUserPassword(tenantSubDomain: string) {
    const credentials: UserCredentials = await SecuredStorage._getJson(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
    if (credentials) {
      Reflect.deleteProperty(credentials, 'password');
      await SecuredStorage.saveUserCredentials(tenantSubDomain, credentials);
    }
  }

  public static async deleteUserCredentials(tenantSubDomain: string) {
    await RNSecureStorage.remove(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
  }

  public static async saveUserCredentials(tenantSubDomain: string, credentials: UserCredentials) {
    // Save last used domain
    await SecuredStorage.saveCurrentTenantSubDomain(tenantSubDomain);
    // Save Credentials
    await RNSecureStorage.set(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`,
      JSON.stringify(credentials),
      { accessible: ACCESSIBLE.WHEN_UNLOCKED }
    );
  }

  public static async saveFilterValue(filterInternalID: string, filterValue: string) {
    // Get Provider
    const centralServerProvider = await ProviderFactory.getProvider();
    // Get Token
    const user = await centralServerProvider.getUserInfo();
    // null value not allowed
    if (!filterValue) {
      filterValue = 'null';
    }
    // Save
    await RNSecureStorage.set(`${user.tenantID}~${user.id}~filter~${filterInternalID}`,
      filterValue,
      { accessible: ACCESSIBLE.WHEN_UNLOCKED });
  }

  public static async filterExists(filterInternalID: string): Promise<boolean> {
    try {
      // Get Provider
      const centralServerProvider = await ProviderFactory.getProvider();
      // Get Token
      const user = await centralServerProvider.getUserInfo();
      // Check
      const result = await RNSecureStorage.exists(`${user.tenantID}~${user.id}~filter~${filterInternalID}`);
      // Returned result is a number, not a boolean! 0 = not found and 1 = found!
      return result;
    } catch (err) {
      // Key does not exist: do nothing
    }
    return false;
  }

  public static async loadFilterValue(filterInternalID: string): Promise<string> {
    // Get Provider
    const centralServerProvider = await ProviderFactory.getProvider();
    // Get Token
    const user = await centralServerProvider.getUserInfo();
    // Get
    const value = await SecuredStorage._getString(`${user.tenantID}~${user.id}~filter~${filterInternalID}`);
    if (value === 'null') {
      return null;
    }
    return value;
  }

  private static getCurrentTenantSubDomain(): Promise<string> {
    return SecuredStorage._getString(SecuredStorageKey.CURRENT_TENANT_SUB_DOMAIN);
  }

  private static async saveCurrentTenantSubDomain(tenantSubDomain: string) {
    await RNSecureStorage.set(SecuredStorageKey.CURRENT_TENANT_SUB_DOMAIN, tenantSubDomain,
      { accessible: ACCESSIBLE.WHEN_UNLOCKED }
    );
  }

  private static async _getJson(key: string): Promise<any> {
    try {
      const data = await RNSecureStorage.get(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      // Key does not exist: do nothing
    }
    return null;
  }

  private static async _getString(key: string): Promise<string> {
    try {
      const data = await RNSecureStorage.get(key);
      return data;
    } catch (err) {
      // Key does not exist: do nothing
    }
    return null;
  }

  public static async saveTenants(tenants: Partial<Tenant>[]) {
    // Add a key
    await RNSecureStorage.set(
      SecuredStorageKey.TENANTS,
      JSON.stringify(tenants),
      { accessible: ACCESSIBLE.WHEN_UNLOCKED }
    );
  }

  public static async getTenants(): Promise<Partial<Tenant>[]> {
    const tenants = await SecuredStorage._getJson(SecuredStorageKey.TENANTS);
    return tenants as Partial<Tenant>[];
  }
}
