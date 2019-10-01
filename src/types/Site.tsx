import Address from './Address';
import Company from './Company';
import ConnectorStats from './ConnectorStats';
import CreatedUpdatedProps from './CreatedUpdatedProps';

export default interface Site extends CreatedUpdatedProps {
  id: string;
  name: string;
  address: Address;
  companyID: string;
  autoUserSiteAssignment: boolean;
  image?: string;
  connectorStats: ConnectorStats;
  company?: Company;
}

export interface SiteUser {
  site: Site;
  userID: string;
  siteAdmin: boolean;
}

