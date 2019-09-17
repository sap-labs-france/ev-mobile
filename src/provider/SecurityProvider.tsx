import Constants from "../utils/Constants";

export default class SecurityProvider {
  constructor(loggedUser) {
    this.loggedUser = loggedUser;
  }

  isAdmin() {
    return this.loggedUser.role === Constants.ROLE_ADMIN;
  }

  isSiteAdmin(siteID) {
    if (this.isAdmin()) {
      return true;
    }
    if (this.canAccess(Constants.ENTITY_SITE, Constants.ACTION_UPDATE)) {
      return this.loggedUser.sitesAdmin && this.loggedUser.sitesAdmin.includes(siteID);
    }
    return false;
  }

  isSiteUser(siteID) {
    if (this.isAdmin()) {
      return true;
    }
    if (this.canAccess(Constants.ENTITY_SITE, Constants.ACTION_READ)) {
      return this.loggedUser.sites && this.loggedUser.sites.includes(siteID);
    }
    return false;
  }

  isBasic() {
    return this.loggedUser.role === Constants.ROLE_BASIC;
  }

  isDemo() {
    return this.loggedUser.role === Constants.ROLE_DEMO;
  }

  isComponentPricingActive() {
    return this.isComponentActive(Constants.COMPONENTS.PRICING);
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
    return this.canAccess(Constants.ENTITY_CHARGING_STATION, Constants.ACTION_UPDATE);
  }

  canStopTransaction(siteArea, badgeID) {
    if (this.canAccess(Constants.ENTITY_CHARGING_STATION, Constants.ACTION_REMOTE_STOP_TRANSACTION)) {
      if (this.loggedUser.tagIDs.includes(badgeID)) {
        return true;
      }
      if (this.isComponentActive(Constants.COMPONENTS.ORGANIZATION)) {
        return siteArea && this.isSiteAdmin(siteArea.siteID);
      }
      return this.isAdmin();
    }
    return false;
  }

  canStartTransaction(siteArea) {
    if (this.canAccess(Constants.ENTITY_CHARGING_STATION, Constants.ACTION_REMOTE_START_TRANSACTION)) {
      if (this.isComponentActive(Constants.COMPONENTS.ORGANIZATION)) {
        if (!siteArea) {
          return false;
        }
        return !siteArea.accessControl || this.isSiteAdmin(siteArea.siteID) || this.loggedUser.sites.includes(siteArea.siteID);
      }
      return true;
    }
    return false;
  }

  canReadTransaction(siteArea, badgeID) {
    if (this.canAccess(Constants.ENTITY_TRANSACTION, Constants.ACTION_READ)) {
      if (this.loggedUser.tagIDs.includes(badgeID)) {
        return true;
      }
      if (this.isComponentActive(Constants.COMPONENTS.ORGANIZATION) && siteArea) {
        return this.isSiteAdmin(siteArea.siteID) || (this.isDemo() && this.isSiteUser(siteArea.siteID));
      }
      return this.isAdmin() || this.isDemo();
    }
    return false;
  }

  canAccess(resource: String, action: String) {
    return this.loggedUser && this.loggedUser.scopes && this.loggedUser.scopes.includes(`${resource}:${action}`);
  }
}
