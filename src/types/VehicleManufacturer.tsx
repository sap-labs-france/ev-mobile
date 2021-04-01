import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import Car from './Car';

export default interface VehicleManufacturer extends CreatedUpdatedProps, ListItem {
  name: string;
  logo?: string;
  vehicles?: Car[];
}
