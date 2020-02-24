import { ChargePointStatus } from '../types/ChargingStation';
import { GlobalFilters } from '../types/Filter';
import SecuredStorage from '../utils/SecuredStorage';

export default class MigrationManager {
  public static getInstance(): MigrationManager {
    return new MigrationManager();
  }

  public migrate = async () => {
    // Init filters
    await this.checkInitialFilters();
  }

  private async checkInitialFilters() {
    // Available chargers
    const filterExists = await SecuredStorage.filterExists(GlobalFilters.ONLY_AVAILABLE_CHARGERS);
    if (!filterExists) {
      // Create initial default value
      await SecuredStorage.saveFilterValue(GlobalFilters.ONLY_AVAILABLE_CHARGERS, ChargePointStatus.AVAILABLE);
    }
  }
}
