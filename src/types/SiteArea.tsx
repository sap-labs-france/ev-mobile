import Site from '../types/Site';
import Address from './Address';
import ConnectorStats from './ConnectorStats';
import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';

export default interface SiteArea extends CreatedUpdatedProps, ListItem {
  name: string;
  maximumPower: number;
  address: Address;
  image: string;
  siteID: string;
  site: Site;
  accessControl: boolean;
  connectorStats: ConnectorStats;
  distanceMeters?: number;
}
