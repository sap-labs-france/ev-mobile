import Constants from "../utils/Constants";

export default class SecurityProvider {
  constructor(loggedUser) {
    this.loggedUser = loggedUser;
  }

  isAdmin() {
    return this.loggedUser.role === Constants.ROLE_ADMIN;
  }

  isBasic() {
    return this.loggedUser.role === Constants.ROLE_BASIC;
  }

  isDemo() {
    return this.loggedUser.role === Constants.ROLE_DEMO;
  }

  isComponentOrganizationActive() {
    return this.isComponentActive(Constants.COMPONENTS.ORGANIZATION);
  }

  isComponentActive(componentName) {
    if (this.loggedUser && this.loggedUser.activeComponents) {
      return this.loggedUser.activeComponents.includes(componentName);
    }
    return false;
  }

  canUpdateChargingStation() {
    return this._canAccess(Constants.ENTITY_CHARGING_STATION, Constants.ACTION_UPDATE);
  }

  _canAccess(resource: String, action: String) {
    return this.loggedUser && this.loggedUser.scopes && this.loggedUser.scopes.includes(`${resource}:${action}`);
  }
}
