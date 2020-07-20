import Address from './Address';
import CreatedUpdatedProps from './CreatedUpdatedProps';

export default interface Company extends CreatedUpdatedProps {
  id: string;
  name: string;
  address: Address;
  logo?: string;
  distanceMeters?: number;
}
