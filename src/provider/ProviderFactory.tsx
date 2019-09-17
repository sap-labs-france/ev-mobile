import CentralServerProvider from "./CentralServerProvider";

export default class ProviderFactory {
  public static async getProvider(): Promise<CentralServerProvider> {
    if (!this.centralServerProvider) {
      // No: return the real provider
      this.centralServerProvider = new CentralServerProvider();
      // Init
      await this.centralServerProvider.initialize();
    }
    return this.centralServerProvider;
  }

  private static centralServerProvider: CentralServerProvider;
}
