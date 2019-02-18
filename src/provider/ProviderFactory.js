import CentralServerProvider from "./CentralServerProvider";
import CentralServerProviderMock from "./CentralServerProviderMock";

const MOCK_DATA = false;

export default class ProviderFactory {
  static getProvider() {
    // Mock?
    if (MOCK_DATA) {
      // Yes: return the mocked provider
      return new CentralServerProviderMock();
    } else {
      // No: return the real provider
      return new CentralServerProvider();
    }
  }
}
