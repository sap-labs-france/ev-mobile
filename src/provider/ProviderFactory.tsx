import CentralServerProvider from './CentralServerProvider';

export default class ProviderFactory {
  private static centralServerProviderInstance: CentralServerProvider;

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static async getProvider(): Promise<CentralServerProvider> {
    // Handling singleton
    if (!ProviderFactory.centralServerProviderInstance) {
      const centralServerProviderInstance = new CentralServerProvider();
      await centralServerProviderInstance.initialize();
      // 2nd IF because both App.tsx and BaseScreen.tsx pass the first IF and only the App.tsx that will set other props must win
      if (!ProviderFactory.centralServerProviderInstance) {
        ProviderFactory.centralServerProviderInstance = centralServerProviderInstance;
      }
    }
    return ProviderFactory.centralServerProviderInstance;
  }
}
