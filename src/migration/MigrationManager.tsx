import I18n from 'i18n-js';

import Configuration from '../config/Configuration';
import CentralServerProvider from '../provider/CentralServerProvider';
import Message from '../utils/Message';
import SecuredStorage from '../utils/SecuredStorage';
import Utils from '../utils/Utils';

export default class MigrationManager {
  private static instance: MigrationManager;
  private currentMigrationVersion = '1.31';
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
  };

  private async removeUnusedTenants() {
    // Get tenants
    const tenants = await this.centralServerProvider.getTenants();
    if (!Utils.isEmptyArray(tenants)) {
      for (let i = tenants.length - 1; i >= 0; i--) {
        const tenant = tenants[i];
        // Proviridis: Switch cloud
        if (tenant.subdomain === 'proviridis' || tenant.subdomain === 'eurecom' || tenant.subdomain === 'imredd') {
          tenant.endpoint = Configuration.AWS_REST_ENDPOINT_PROD;
        }
      }
    }
    await SecuredStorage.saveTenants(tenants);
  }
}
