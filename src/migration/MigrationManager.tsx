import I18n from 'i18n-js';

import Configuration from '../config/Configuration';
import CentralServerProvider from '../provider/CentralServerProvider';
import Message from '../utils/Message';
import SecuredStorage from '../utils/SecuredStorage';

export default class MigrationManager {
  private static instance: MigrationManager;
  private currentMigrationVersion = '2.0.21';
  private centralServerProvider: CentralServerProvider;

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static getInstance(): MigrationManager {
    if (!MigrationManager.instance) {
      MigrationManager.instance = new MigrationManager();
    }
    return MigrationManager.instance;
  }

  public setCentralServerProvider(centralServerProvider: CentralServerProvider): void {
    this.centralServerProvider = centralServerProvider;
  }

  public async migrate ()  {
    const lastMigrationVersion = await SecuredStorage.getLastMigrationVersion();
    // Check
    if (lastMigrationVersion !== this.currentMigrationVersion) {
      try {
        // Migrate Tenant endpoints
        await this.refactorTenants();
        // Save
        await SecuredStorage.setLastMigrationVersion(this.currentMigrationVersion);
      } catch (error) {
        // Error in code
        Message.showError(I18n.t('general.migrationError'));
      }
    }
  };

  private async refactorTenants(): Promise<void> {
    const tenants = await SecuredStorage.getTenants();
    tenants.forEach(tenant => {
      const tenantEndpoint = tenant?.endpoint;
      // Only search among static endpoints because custom endpoints are new
      const endpoints = Configuration.getEndpoints();
      const endpoint = endpoints.find(e => e?.endpoint === tenantEndpoint as unknown as string);
      tenant.endpoint = {
        name: endpoint?.name,
        endpoint: endpoint?.endpoint
      }
    });
    await SecuredStorage.saveTenants(tenants);
  }

/*  private async removeUnusedTenants() {
    // Get tenants
    const tenants = await this.centralServerProvider.getTenants();
    if (!Utils.isEmptyArray(tenants)) {
      for (let i = tenants.length - 1; i >= 0; i--) {
        const tenant = tenants[i];
        // Switch to AWS cloud
        if (['slfcah', 'slf', 'imredd', 'eurecom', 'proviridis'].includes(tenant.subdomain) &&
          tenant.endpoint !== Configuration.AWS_REST_ENDPOINT_PROD) {
          // Set AWS
          tenant.endpoint = Configuration.AWS_REST_ENDPOINT_PROD;
        }
      }
    }
    await SecuredStorage.saveTenants(tenants);
  }*/
}
