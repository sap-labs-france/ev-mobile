import Utils from '../utils/Utils';
import CentralServerProvider from './CentralServerProvider';

export default class ProviderFactory {
  private static centralServerProvider: CentralServerProvider;
  private static underInitialization: boolean;

  private constructor() {
    ProviderFactory.underInitialization = false;
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
    // Init
    if (!ProviderFactory.centralServerProvider) {
      // Handling singleton
      ProviderFactory.underInitialization = true;
      // No: return the real provider
      ProviderFactory.centralServerProvider = new CentralServerProvider();
      // Init
      await ProviderFactory.centralServerProvider.initialize();
      // End
      ProviderFactory.underInitialization = false;
    }
    return ProviderFactory.centralServerProvider;
  }

}
