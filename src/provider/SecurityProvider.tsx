import SiteArea from '../types/SiteArea';
import UserToken from '../types/UserToken';
import Constants from '../utils/Constants';

export default class SecurityProvider {
  private loggedUser: UserToken;

  constructor(loggedUser: UserToken) {
    this.loggedUser = loggedUser;
  }

  public isAdmin(): boolean {
    return this.loggedUser.role === Constants.ROLE_ADMIN;
  }

  public isSiteAdmin(siteID: string): boolean {
    if (this.isAdmin()) {
      return true;
    }
    if (this.canAccess(Constants.ENTITY_SITE, Constants.ACTION_UPDATE)) {
      return this.loggedUser.sitesAdmin && this.loggedUser.sitesAdmin.includes(siteID);
    }
    return false;
  }

  public isSiteUser(siteID: string) {
    if (this.isAdmin()) {
      return true;
    }
    if (this.canAccess(Constants.ENTITY_SITE, Constants.ACTION_READ)) {
      return this.loggedUser.sites && this.loggedUser.sites.includes(siteID);
    }
    return false;
  }

  public isBasic(): boolean {
    return this.loggedUser.role === Constants.ROLE_BASIC;
  }

  public isDemo(): boolean {
    return this.loggedUser.role === Constants.ROLE_DEMO;
  }

  public isComponentPricingActive(): boolean {
    return this.isComponentActive(Constants.COMPONENTS.PRICING);
  }

  public isComponentOrganizationActive(): boolean {
    return this.isComponentActive(Constants.COMPONENTS.ORGANIZATION);
  }

  public isComponentActive(componentName: string): boolean {
    if (this.loggedUser && this.loggedUser.activeComponents) {
      return this.loggedUser.activeComponents.includes(componentName);
    }
    return false;
  }

  public canUpdateChargingStation(): boolean {
    return this.canAccess(Constants.ENTITY_CHARGING_STATION, Constants.ACTION_UPDATE);
  }

  public canStopTransaction(siteArea: SiteArea, badgeID: string): boolean {
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

  public canStartTransaction(siteArea: SiteArea): boolean {
    if (this.canAccess(Constants.ENTITY_CHARGING_STATION, Constants.ACTION_REMOTE_START_TRANSACTION)) {
      if (this.isComponentActive(Constants.COMPONENTS.ORGANIZATION)) {
        if (!siteArea) {
          return false;
        }
        return !siteArea.accessControl || this.isSiteAdmin(siteArea.siteID) ||
          this.loggedUser.sites.includes(siteArea.siteID);
      }
      return true;
    }
    return false;
  }

  public canReadTransaction(siteArea: SiteArea, badgeID: string): boolean {
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

  public canAccess(resource: string, action: string): boolean {
    return this.loggedUser && this.loggedUser.scopes && this.loggedUser.scopes.includes(`${resource}:${action}`);
  }
}
