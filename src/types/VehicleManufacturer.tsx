import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import Vehicle from './Vehicle';

export default interface VehicleManufacturer extends CreatedUpdatedProps, ListItem {
  name: string;
  logo?: string;
  vehicles?: Vehicle[];
}
