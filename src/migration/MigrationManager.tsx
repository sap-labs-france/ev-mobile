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
    const connectorStatus = await SecuredStorage.loadFilterValue(GlobalFilters.ONLY_AVAILABLE_CHARGERS) as ChargePointStatus;
    if (!connectorStatus) {
      await SecuredStorage.saveFilterValue(GlobalFilters.ONLY_AVAILABLE_CHARGERS, ChargePointStatus.AVAILABLE);
    }
  }
}
