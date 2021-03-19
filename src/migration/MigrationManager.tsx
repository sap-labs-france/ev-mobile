import I18n from 'i18n-js';
import { TenantConnection } from 'types/Tenant';

import CentralServerProvider from '../provider/CentralServerProvider';
import Message from '../utils/Message';
import SecuredStorage from '../utils/SecuredStorage';
import Utils from '../utils/Utils';

export default class MigrationManager {
  private static instance: MigrationManager;
  private currentMigrationVersion = '1.1';
  private centralServerProvider: CentralServerProvider;

  private constructor() {
  }

  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  public setCentralServerProvider(centralServerProvider: CentralServerProvider) {
    this.centralServerProvider = centralServerProvider;
  }

  public migrate = async () => {
    const lastMigrationVersion = await SecuredStorage.getLastMigrationVersion();
    // Check
    if (lastMigrationVersion !== this.currentMigrationVersion) {
      try {
        // Migrate Tenant endpoints
        await this.removeUnusedTenants();
        // Save
        await SecuredStorage.setLastMigrationVersion(this.currentMigrationVersion);
      } catch (error) {
        // Error in code
        Message.showError(I18n.t('general.migrationError'));
      }
    }
  }

  private async removeUnusedTenants() {
    // Get tenants
    const tenants = await this.centralServerProvider.getTenants();
    if (!Utils.isEmptyArray(tenants)) {
      for (let i = tenants.length - 1; i >= 0; i--) {
        const tenant = tenants[i];
        // Check if user has used this tenant
        const userCredentials = await SecuredStorage.getUserCredentials(tenant.subdomain);
        if (!userCredentials) {
          // Remove the tenant
          tenants.splice(i, 1);
        }
      }
    }
    // Save
    await SecuredStorage.saveTenants(tenants);
  }
}
