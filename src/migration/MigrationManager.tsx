import I18n from 'i18n-js';

import Configuration from '../config/Configuration';
import Message from '../utils/Message';
import SecuredStorage from '../utils/SecuredStorage';
import { TenantConnection } from '../types/Tenant';

export default class MigrationManager {
  private static instance: MigrationManager;
  private currentMigrationVersion = '2.0.21';

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  public async migrate ()  {
    const lastMigrationVersion = await SecuredStorage.getLastMigrationVersion();
    // Check
    if (lastMigrationVersion !== this.currentMigrationVersion) {
      try {
        // Migrate Tenant endpoints
        let tenants = await SecuredStorage.getTenants() || [];
        tenants = await this.refactorTenants(tenants);
        await SecuredStorage.saveTenants(tenants);
        // Save
        await SecuredStorage.setLastMigrationVersion(this.currentMigrationVersion);
      } catch (error) {
        // Error in code
        Message.showError(I18n.t('general.migrationError'));
      }
    }
  }

  public async refactorTenants(tenants: any[]): Promise<TenantConnection[]> {
    tenants.forEach(tenant => {
      const tenantEndpoint = tenant?.endpoint;
      // Only search among static endpoints because custom endpoints are new
      const endpoints = Configuration.getEndpoints();
      const endpoint = endpoints.find(e => e?.endpoint === tenantEndpoint as unknown as string);
      if (!tenant.endpoint?.name) {
        tenant.endpoint = {
          name: endpoint?.name,
          endpoint: endpoint?.endpoint
        };
      }
    });
    return tenants;
  }
}
