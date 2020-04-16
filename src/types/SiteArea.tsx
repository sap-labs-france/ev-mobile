import Site from '../types/Site';
import Address from './Address';
import ConnectorStats from './ConnectorStats';
import CreatedUpdatedProps from './CreatedUpdatedProps';

export default interface SiteArea extends CreatedUpdatedProps {
  id: string;
  name: string;
  maximumPower: number;
  address: Address;
  image: string;
  siteID: string;
  site: Site;
  accessControl: boolean;
  connectorStats: ConnectorStats;
}
