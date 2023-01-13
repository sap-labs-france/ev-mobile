import { NavigationState } from '@react-navigation/native';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

import { SecuredStorageKey } from '../types/SecuredStorageKeys';
import Tenant, { EndpointCloud, TenantConnection } from '../types/Tenant';
import { UserCredentials } from '../types/User';
import UserToken from '../types/UserToken';
import { Settings } from '../types/Settings';

// Generate a new Id for persisting the navigation each time the app is launched for the first time
let navigationID: string = new Date().getTime().toString();
if (__DEV__) {
  // Keep the same key for dev
  navigationID = '123456789';
}

export default class SecuredStorage {
  public static async getLastMigrationVersion(): Promise<string> {
    return SecuredStorage.getString(SecuredStorageKey.MIGRATION_VERSION);
  }

  public static async setLastMigrationVersion(version: string): Promise<void> {
    await RNSecureStorage.set(SecuredStorageKey.MIGRATION_VERSION, version, { accessible: ACCESSIBLE.WHEN_UNLOCKED });
  }

  public static async getNavigationState(): Promise<NavigationState> {
    const navigationState = (await SecuredStorage.getJson(SecuredStorageKey.NAVIGATION_STATE)) as {
      key: string;
      navigationState: NavigationState;
    };
    return navigationState?.navigationState;
  }

  public static async saveNavigationState(navigationState: NavigationState): Promise<void> {
    await RNSecureStorage.set(SecuredStorageKey.NAVIGATION_STATE, JSON.stringify({ key: navigationID, navigationState }), {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
  }

  public static async getUserCredentials(tenantSubDomain?: string): Promise<UserCredentials> {
    // Get current domain
    if (!tenantSubDomain) {
      tenantSubDomain = await SecuredStorage.getCurrentTenantSubDomain();
    }
    // Get User Credentials
    return SecuredStorage.getJson(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`) as Promise<UserCredentials>;
  }

  public static async clearUserToken(tenantSubDomain: string): Promise<void> {
    const credentials = await SecuredStorage.getJson(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
    if (credentials) {
      Reflect.deleteProperty(credentials, 'token');
      await SecuredStorage.saveUserCredentials(tenantSubDomain, credentials);
    }
  }

  public static async clearUserPassword(tenantSubDomain: string): Promise<void> {
    const credentials: UserCredentials = await SecuredStorage.getJson(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
    if (credentials) {
      Reflect.deleteProperty(credentials, 'password');
      await SecuredStorage.saveUserCredentials(tenantSubDomain, credentials);
    }
  }

  public static async deleteUserCredentials(tenantSubDomain: string): Promise<void> {
    try {
      await RNSecureStorage.remove(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`);
    } catch (error) {
      // Error ff it does not exist
    }
  }

  public static async saveUserCredentials(tenantSubDomain: string, credentials: UserCredentials): Promise<void> {
    // Save last used domain
    await SecuredStorage.saveCurrentTenantSubDomain(tenantSubDomain);
    // Save Credentials
    await RNSecureStorage.set(`${tenantSubDomain}~${SecuredStorageKey.CREDENTIALS}`, JSON.stringify(credentials), {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
  }

  public static async saveFilterValue(user: UserToken, filterInternalID: string, filterValue: string | boolean): Promise<void> {
    // Ensure string
    if (typeof filterValue !== 'string') {
      filterValue = String(filterValue);
    }
    // null value not allowed
    if (!filterValue) {
      filterValue = 'null';
    }
    // Save
    await RNSecureStorage.set(`${user.tenantID}~${user.id}~filter~${filterInternalID}`, filterValue, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
  }

  public static async filterExists(user: UserToken, filterInternalID: string): Promise<boolean> {
    try {
      // Check
      const result = await RNSecureStorage.exists(`${user.tenantID}~${user.id}~filter~${filterInternalID}`);
      // Returned result is a number, not a boolean! 0 = not found and 1 = found!
      return result;
    } catch (err) {
      // Key does not exist: do nothing
    }
    return false;
  }

  public static async loadFilterValue(user: UserToken, filterInternalID: string): Promise<string | boolean> {
    // Get
    const value = await SecuredStorage.getString(`${user?.tenantID}~${user?.id}~filter~${filterInternalID}`);
    if (value === 'null' || value === 'undefined' ) {
      return null;
    }
    if ((/true/i).test(value)) {
      return true;
    }
    if ((/false/i).test(value)) {
      return false;
    }
    return value;
  }

  public static async getCurrentTenantSubDomain(): Promise<string> {
    return SecuredStorage.getString(SecuredStorageKey.CURRENT_TENANT_SUB_DOMAIN);
  }

  public static async saveCurrentTenantSubDomain(tenantSubDomain: string): Promise<void> {
    await RNSecureStorage.set(SecuredStorageKey.CURRENT_TENANT_SUB_DOMAIN, tenantSubDomain, { accessible: ACCESSIBLE.WHEN_UNLOCKED });
  }

  public static async saveTenants(tenants: Partial<Tenant>[]): Promise<void> {
    // Add a key
    await RNSecureStorage.set(SecuredStorageKey.TENANTS, JSON.stringify(tenants), { accessible: ACCESSIBLE.WHEN_UNLOCKED });
  }

  public static async getTenants(): Promise<TenantConnection[]> {
    const tenants = (await SecuredStorage.getJson(SecuredStorageKey.TENANTS)) || [];
    return tenants as TenantConnection[];
  }

  public static async saveEndpoints(endpoints: EndpointCloud[]): Promise<void> {
    await RNSecureStorage.set(SecuredStorageKey.ENDPOINTS, JSON.stringify(endpoints), { accessible: ACCESSIBLE.WHEN_UNLOCKED });
  }

  public static async getEndpoints(): Promise<EndpointCloud[]> {
    const endpoints = (await SecuredStorage.getJson(SecuredStorageKey.ENDPOINTS)) || [];
    return endpoints as EndpointCloud[];
  }

  /**
   * Overrides only the given settings values
   * @param settings
   */
  public static async saveSettingsValues(settings: Settings): Promise<void> {
    const savedSettings = await SecuredStorage.getSettings();
    const newSettings = {...(savedSettings || {}), ...(settings || {})};
    await RNSecureStorage.set(SecuredStorageKey.SETTINGS, JSON.stringify(newSettings), { accessible: ACCESSIBLE.WHEN_UNLOCKED });
  }

  public static async getSettings(): Promise<Settings> {
    const settings = (await SecuredStorage.getJson(SecuredStorageKey.SETTINGS)) || {};
    return settings as Settings;
  }

  private static async getJson(key: string): Promise<any | null> {
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

  private static async getString(key: string): Promise<string> {
    try {
      const data = await RNSecureStorage.get(key);
      return data;
    } catch (err) {
      // Key does not exist: do nothing
    }
    return null;
  }
}
