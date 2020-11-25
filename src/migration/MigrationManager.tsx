import I18n from 'i18n-js';
import { TenantConnection } from 'types/Tenant';

import Configuration from '../config/Configuration';
import CentralServerProvider from '../provider/CentralServerProvider';
import Message from '../utils/Message';
import SecuredStorage from '../utils/SecuredStorage';

export default class MigrationManager {
  private static instance: MigrationManager;
  private currentMigrationVersion: string = '1.0';
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
        await this.migrateTenantEndpoints();
        // Save
        await SecuredStorage.setLastMigrationVersion(this.currentMigrationVersion);
      } catch (error) {
        // Error in code
        Message.showError(I18n.t('general.migrationError'));
      }
    }
  }

  private async migrateTenantEndpoints() {
    if (__DEV__) {
      // Override
      await SecuredStorage.saveTenants(Configuration.DEFAULT_TENANTS_LIST_QA);
    } else {
      // Get tenants
      const tenants = await this.centralServerProvider.getTenants();
      for (const tenant of tenants) {
        if (!tenant.endpoint) {
          // Default to SCP
          tenant.endpoint = Configuration.SCP_REST_ENDPOINT_PROD;
        }
      }
      // Add new tenants
      this.addNewTenant(tenants, {
        subdomain: 'mairiedemonaco', name: 'Mairie de Monaco', endpoint: Configuration.AWS_REST_ENDPOINT_PROD,
      });
      this.addNewTenant(tenants, {
        subdomain: 'chargex', name: 'ChargeX', endpoint: Configuration.AWS_REST_ENDPOINT_PROD,
      });
      this.addNewTenant(tenants, {
        subdomain: 'sapfrance', name: 'SAP France', endpoint: Configuration.SCP_REST_ENDPOINT_PROD,
      });
      this.addNewTenant(tenants, {
        subdomain: 'sapfrancecah', name: 'SAP France (charge@home)', endpoint: Configuration.SCP_REST_ENDPOINT_PROD,
      });
      this.addNewTenant(tenants, {
        subdomain: 'imredd', name: 'IMREDD', endpoint: Configuration.SCP_REST_ENDPOINT_PROD,
      });
      // Save
      await SecuredStorage.saveTenants(tenants);
    }
  }

  private async addNewTenant(tenants: TenantConnection[], newTenant: TenantConnection) {
    if (!tenants) {
      return;
    }
    const foundTenant = tenants.find((tenant) => tenant.subdomain === newTenant.subdomain);
    // Add tenant
    if (!foundTenant) {
      tenants.push(newTenant);
    }
  }
}
