import Utils from '../utils/Utils';
import CentralServerProvider from './CentralServerProvider';

export default class ProviderFactory {
  private static centralServerProviderInstance: CentralServerProvider;
  private static underInitialization: boolean;

  private constructor() {
  }

  private static async checkAndWaitForEndOfInit() {
    // Wait
    while (ProviderFactory.underInitialization) {
      await Utils.sleep(500);
    }
  }

  public static async getProvider(): Promise<CentralServerProvider> {
    // Check
    await ProviderFactory.checkAndWaitForEndOfInit();
    // Handling singleton
    if (!ProviderFactory.centralServerProviderInstance) {
      ProviderFactory.underInitialization = true;
      ProviderFactory.centralServerProviderInstance = new CentralServerProvider();
      await ProviderFactory.centralServerProviderInstance.initialize();
      ProviderFactory.underInitialization = false;
    }
    return ProviderFactory.centralServerProviderInstance;
  }
}
