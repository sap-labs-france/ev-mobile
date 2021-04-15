import Car from './Car';
import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';

export default interface VehicleManufacturer extends CreatedUpdatedProps, ListItem {
  name: string;
  logo?: string;
  vehicles?: Car[];
}
