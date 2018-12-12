
import Constants from "../utils/Constants";

export default class  SecurityProvider {

  constructor(decodedToken) {
    this.decodedToken = decodedToken;
  }

  async isAdmin() {
    // Init?
    await this.initialize();
    // Check
    return (this.decodedToken.role === Constants.ROLE_ADMIN);
  }

  async isBasic() {
    // Init?
    await this.initialize();
    // Check
    return (this.decodedToken.role === Constants.ROLE_BASIC);
  }
}