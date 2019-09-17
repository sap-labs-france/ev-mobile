import CentralServerProvider from "./CentralServerProvider";
import CentralServerProviderMock from "./CentralServerProviderMock";

const MOCK_DATA = false;

export default class ProviderFactory {
  static async getProvider() {
    if (!this.centralServerProvider) {
      // Mock?
      if (MOCK_DATA) {
        // Yes: return the mocked provider
        this.centralServerProvider = new CentralServerProviderMock();
      } else {
        // No: return the real provider
        this.centralServerProvider = new CentralServerProvider();
      }
      // Init
      await this.centralServerProvider.initialize();
    }
    return this.centralServerProvider;
  }
}
